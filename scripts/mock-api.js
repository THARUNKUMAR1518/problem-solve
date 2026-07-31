#!/usr/bin/env node
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

// Helper to convert array to linked list
function arrayToLinkedList(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let head = { val: arr[0], next: null };
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null };
    current = current.next;
  }
  return head;
}

// Helper to convert linked list to array
function linkedListToArray(head) {
  const arr = [];
  let current = head;
  while (current !== null) {
    arr.push(current.val !== undefined ? current.val : current.value);
    current = current.next;
  }
  return arr;
}

// Helper to run JavaScript code
function runJavascriptCode(source, inputStr) {
  const logs = [];
  const sandbox = {
    console: {
      log: (...args) => {
        logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      }
    }
  };
  vm.createContext(sandbox);

  let result;
  try {
    const script = new vm.Script(source);
    result = script.runInContext(sandbox);
  } catch (err) {
    throw new Error('Runtime/Syntax Error: ' + err.message);
  }

  const keys = Object.keys(sandbox).filter(k => typeof sandbox[k] === 'function');

  if (keys.length > 0) {
    const fnMatch = source.match(/function\s+([a-zA-Z0-9_$]+)/) || source.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*/);
    const fnName = (fnMatch && keys.includes(fnMatch[1])) ? fnMatch[1] : keys[0];
    const fn = sandbox[fnName];

    let arg;
    try {
      arg = JSON.parse(inputStr);
    } catch (e) {
      if (!isNaN(inputStr) && inputStr.trim() !== '') {
        arg = Number(inputStr);
      } else {
        arg = inputStr;
      }
    }

    const isLinkedListQuestion = source.toLowerCase().includes('linked') || source.toLowerCase().includes('head');
    if (isLinkedListQuestion && Array.isArray(arg)) {
      arg = arrayToLinkedList(arg);
    }

    const fnResult = fn(arg);

    let finalResult = fnResult;
    if (isLinkedListQuestion && fnResult && (fnResult.val !== undefined || fnResult.next !== undefined)) {
      finalResult = linkedListToArray(fnResult);
    }

    if (finalResult !== undefined) {
      return {
        output: typeof finalResult === 'object' ? JSON.stringify(finalResult) : String(finalResult),
        logs: logs.join('\n')
      };
    }
  }

  if (logs.length > 0) {
    return {
      output: logs.join('\n'),
      logs: logs.join('\n')
    };
  }

  if (result !== undefined) {
    return {
      output: typeof result === 'object' ? JSON.stringify(result) : String(result),
      logs: ''
    };
  }

  throw new Error("No output returned and no console.log output captured.");
}

// Helper to execute Java test cases
function executeJavaTestCases(source, testCases) {
  return new Promise((resolve, reject) => {
    let executableSource = source;
    let className = 'Solution';

    const classMatch = source.match(/class\s+([A-Za-z0-9_$]+)/);
    if (classMatch) {
      className = classMatch[1];
    } else {
      executableSource = `
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        try {
            ${source.trim().endsWith(";") || source.includes("System.out") ? source : `System.out.println(${source});`}
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
      `;
    }

    const tempDir = path.join(process.cwd(), 'temp_java_runs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const javaFilePath = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(javaFilePath, executableSource);

    const cleanup = () => {
      try {
        if (fs.existsSync(tempDir)) {
          const files = fs.readdirSync(tempDir);
          for (const file of files) {
            if (file.startsWith(className)) {
              fs.unlinkSync(path.join(tempDir, file));
            }
          }
        }
      } catch (e) {
        console.error('Cleanup failed:', e);
      }
    };

    exec(`javac "${javaFilePath}"`, async (compileErr, stdout, stderr) => {
      if (compileErr) {
        cleanup();
        return resolve({
          compiled: false,
          errors: stderr || stdout || compileErr.message
        });
      }

      const results = [];
      for (const tc of testCases) {
        try {
          const tcResult = await new Promise((resVal, rejVal) => {
            const child = exec(`java -cp "${tempDir}" ${className}`, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
              if (runErr) {
                rejVal(new Error(runStderr || runStdout || runErr.message));
              } else {
                resVal(runStdout);
              }
            });
            child.stdin.write(tc.input);
            child.stdin.end();
          });

          const cleanActual = tcResult.trim().replace(/\r/g, '');
          const cleanExpected = (tc.output || '').trim().replace(/\r/g, '');
          const passed = cleanActual === cleanExpected;

          results.push({
            input: tc.input,
            expected: tc.output,
            actual: tcResult.trim(),
            passed: passed,
            hidden: tc.hidden || false
          });
        } catch (runErr) {
          results.push({
            input: tc.input,
            expected: tc.output,
            actual: `[ERROR] ${runErr.message}`,
            passed: false,
            hidden: tc.hidden || false
          });
        }
      }

      cleanup();
      resolve({
        compiled: true,
        results: results
      });
    });
  });
}

// Helper to execute Python test cases
function executePythonTestCases(source, testCases) {
  return new Promise((resolve, reject) => {
    const fnMatch = source.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    const fnName = fnMatch ? fnMatch[1] : null;

    let executableSource = source;
    const hasMainBlock = source.includes("__main__") || source.includes("print(");

    if (fnName && !hasMainBlock) {
      executableSource += `

import sys
import json

def _run_wrapper():
    input_data = sys.stdin.read().strip()
    if not input_data:
        return
    try:
        arg = json.loads(input_data)
    except Exception:
        try:
            if '.' in input_data:
                arg = float(input_data)
            else:
                arg = int(input_data)
        except Exception:
            arg = input_data

    is_ll = "linked" in """${source.toLowerCase()}""" or "head" in """${source.toLowerCase()}"""
    if is_ll and isinstance(arg, list):
        class ListNode:
            def __init__(self, val=0, next=None):
                self.val = val
                self.next = next
        
        def to_ll(arr):
            if not arr: return None
            h = ListNode(arr[0])
            c = h
            for x in arr[1:]:
                c.next = ListNode(x)
                c = c.next
            return h
            
        def to_arr(h):
            arr = []
            while h:
                arr.append(h.val if hasattr(h, 'val') else h.value)
                h = h.next
            return arr
            
        arg = to_ll(arg)
        res = ${fnName}(arg)
        res = to_arr(res)
    else:
        res = ${fnName}(arg)
        
    if res is not None:
        if isinstance(res, (dict, list)):
            print(json.dumps(res))
        else:
            print(res)

if __name__ == '__main__':
    _run_wrapper()
`;
    }

    const tempDir = path.join(process.cwd(), 'temp_python_runs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const runId = Math.random().toString(36).substring(2, 9);
    const pythonFilePath = path.join(tempDir, `run_${runId}.py`);
    fs.writeFileSync(pythonFilePath, executableSource);

    exec(`python -m py_compile "${pythonFilePath}"`, async (compileErr, stdout, stderr) => {
      const cleanup = () => {
        try {
          if (fs.existsSync(pythonFilePath)) {
            fs.unlinkSync(pythonFilePath);
          }
          const pycache = path.join(tempDir, '__pycache__');
          if (fs.existsSync(pycache)) {
            const files = fs.readdirSync(pycache);
            for (const file of files) {
              fs.unlinkSync(path.join(pycache, file));
            }
            fs.rmdirSync(pycache);
          }
        } catch (e) { }
      };

      if (compileErr) {
        cleanup();
        return resolve({
          compiled: false,
          errors: stderr || stdout || compileErr.message
        });
      }

      const results = [];
      for (const tc of testCases) {
        try {
          const tcResult = await new Promise((resVal, rejVal) => {
            const child = exec(`python "${pythonFilePath}"`, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
              if (runErr) {
                rejVal(new Error(runStderr || runStdout || runErr.message));
              } else {
                resVal(runStdout);
              }
            });
            child.stdin.write(tc.input);
            child.stdin.end();
          });

          const cleanActual = tcResult.trim().replace(/\r/g, '');
          const cleanExpected = (tc.output || '').trim().replace(/\r/g, '');
          const passed = cleanActual === cleanExpected;

          results.push({
            input: tc.input,
            expected: tc.output,
            actual: tcResult.trim(),
            passed: passed,
            hidden: tc.hidden || false
          });
        } catch (runErr) {
          results.push({
            input: tc.input,
            expected: tc.output,
            actual: `[ERROR] ${runErr.message}`,
            passed: false,
            hidden: tc.hidden || false
          });
        }
      }

      cleanup();
      resolve({
        compiled: true,
        results: results
      });
    });
  });
}

function executeJavaScriptTestCases(source, testCases) {
  const results = [];
  for (const tc of testCases) {
    try {
      const runRes = runJavascriptCode(source, tc.input);
      const cleanActual = runRes.output.trim().replace(/\r/g, '');
      const cleanExpected = (tc.output || '').trim().replace(/\r/g, '');
      results.push({
        input: tc.input,
        expected: tc.output,
        actual: runRes.output,
        passed: cleanActual === cleanExpected,
        hidden: tc.hidden || false
      });
    } catch (err) {
      results.push({
        input: tc.input,
        expected: tc.output,
        actual: `[ERROR] ${err.message}`,
        passed: false,
        hidden: tc.hidden || false
      });
    }
  }
  return { compiled: true, results };
}

async function executeTestCases(language, source, testCases) {
  if (language === 'javascript' || language === 'js') {
    return executeJavaScriptTestCases(source, testCases);
  } else if (language === 'java') {
    return await executeJavaTestCases(source, testCases);
  } else if (language === 'python' || language === 'py') {
    return await executePythonTestCases(source, testCases);
  } else {
    return {
      compiled: true,
      results: testCases.map(tc => ({
        input: tc.input,
        expected: tc.output,
        actual: tc.output,
        passed: true,
        hidden: tc.hidden || false
      }))
    };
  }
}


const upload = multer({ storage: multer.memoryStorage() });

function isOptionLine(line) {
  return /^(?:question\s+)?option/i.test(line) || 
         /^(?:opt)\b/i.test(line) ||
         /^[a-d\d](?:\.|\)|:|-)\s*/i.test(line) || 
         /^\((?:[a-d\d])\)\s*/i.test(line);
}

function isAnswerLine(line) {
  return /^(?:correct\s+)?ans(?:wer)?(?:\s*:\s*|\s+)/i.test(line) || 
         /^key(?:\s*:\s*|\s+)/i.test(line);
}

function parseQuestionsFromText(text) {
  const cleanText = text.replace(/\r/g, '');
  const lines = cleanText.split('\n');
  const questionsList = [];
  
  let currentQuestion = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    // 1. Detect a new question starting (e.g. "Question 1", "Question:", "1. ", "Q1:", etc.)
    const qMatch = line.match(/^(?:(?:question|q)\s*(\d+)?\s*(?:\.|\)|:|-)?\s*)(.*)$/i) || 
                   line.match(/^(\d+)(?:\.|\)|:|-)\s*(.*)$/i);
    
    if (qMatch) {
      if (currentQuestion) {
        questionsList.push(finalizeQuestion(currentQuestion));
      }
      
      let qText = qMatch[2] ? qMatch[2].trim() : '';
      // If question text is empty (e.g. "Question 1" is on its own line), look at the next line
      if (qText === '' && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine !== '' && !isOptionLine(nextLine) && !isAnswerLine(nextLine)) {
          qText = nextLine;
          i++; // Consume next line
        }
      }

      currentQuestion = {
        questionText: qText,
        options: [],
        correctAnswer: null,
        questionType: 'OBJECTIVE',
        difficulty: 'MEDIUM',
        marks: 1
      };
      continue;
    }

    if (currentQuestion) {
      // 2. Detect options (e.g. "A) Choice", "a. Choice", "Option A: Choice", "Option Choice")
      const optMatch = line.match(/^(?:(?:question\s+)?option|opt)?\s*([a-d\d])?(?:\.|\)|:|-)?\s*(.*)$/i) || 
                       line.match(/^\((?:[a-d\d])\)\s*(.*)$/i);
      if (optMatch) {
        const optText = optMatch[2] ? optMatch[2].trim() : '';
        if (optText !== '') {
          currentQuestion.options.push(optText);
          continue;
        }
      }

      // 3. Detect answers (e.g. "Answer: B", "Ans: Choice text")
      const ansMatch = line.match(/^(?:correct\s+)?ans(?:wer)?(?:\s*:\s*|\s+)(.*)$/i) || 
                       line.match(/^key(?:\s*:\s*|\s+)(.*)$/i);
      if (ansMatch) {
        const val = ansMatch[1].trim();
        const valUpper = val.toUpperCase();
        // Check standard MCQ indices first
        const codeMap = { A: 0, B: 1, C: 2, D: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
        if (codeMap[valUpper] !== undefined) {
          currentQuestion.correctAnswer = codeMap[valUpper];
        } else {
          // Store raw answer text to map during finalization
          currentQuestion.correctAnswer = val;
        }
        continue;
      }

      // 4. Append to question body if we haven't seen options/answers yet
      if (currentQuestion.options.length === 0 && currentQuestion.correctAnswer === null) {
        currentQuestion.questionText += '\n' + line;
      }
    }
  }

  if (currentQuestion) {
    questionsList.push(finalizeQuestion(currentQuestion));
  }

  return questionsList;
}

function finalizeQuestion(q) {
  const questionType = q.options.length > 0 ? 'OBJECTIVE' : 'SHORT_ANSWER';
  let correctAnswerJson = '';

  if (q.correctAnswer !== null) {
    if (questionType === 'OBJECTIVE') {
      const rawAns = String(q.correctAnswer).trim();
      const rawAnsLower = rawAns.toLowerCase();

      // Check if it's already a valid option index number
      if (!isNaN(rawAns) && Number(rawAns) >= 0 && Number(rawAns) < q.options.length) {
        correctAnswerJson = String(Number(rawAns));
      } else {
        // Strip prefixes to isolate the option letter (A/B/C/D)
        let cleanAns = rawAnsLower.replace(/^(?:option|opt|key|ans|answer)\s*/i, '').trim();
        const letterMatch = cleanAns.match(/^([a-d\d])(?:\.|\)|:|-|\s|$)/i);
        let answerCode = null;
        if (letterMatch) {
          answerCode = letterMatch[1].toUpperCase();
        }

        const codeMap = { A: 0, B: 1, C: 2, D: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
        let foundIdx = -1;

        if (answerCode && codeMap[answerCode] !== undefined) {
          foundIdx = codeMap[answerCode];
        } else {
          // Fallback: try matching choice text back to option index (exact or substring)
          foundIdx = q.options.findIndex(opt => {
            const optLower = opt.toLowerCase();
            return optLower === rawAnsLower || optLower.includes(rawAnsLower) || rawAnsLower.includes(optLower);
          });
        }

        if (foundIdx !== -1 && foundIdx < q.options.length) {
          correctAnswerJson = String(foundIdx);
        } else {
          correctAnswerJson = '0';
        }
      }
    } else {
      correctAnswerJson = String(q.correctAnswer);
    }
  } else {
    correctAnswerJson = questionType === 'OBJECTIVE' ? '0' : '';
  }

  return {
    questionText: q.questionText.trim(),
    questionType: questionType,
    difficulty: q.difficulty,
    marks: q.marks,
    optionsJson: q.options.length > 0 ? JSON.stringify(q.options) : null,
    correctAnswerJson: correctAnswerJson,
    testCasesJson: null,
    programmingLanguage: null
  };
}

const PORT = process.env.MOCK_API_PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'secureassess';

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected to MongoDB', MONGO_URI);
  const db = client.db(DB_NAME);

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const wrap = fn => async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error('API error', err);
      res.status(500).json({ error: String(err) });
    }
  };

  const assessments = db.collection('assessments');
  const questions = db.collection('questions');
  const sessions = db.collection('sessions');
  const users = db.collection('users');
  const departments = db.collection('departments');
  const colleges = db.collection('colleges');
  const subjects = db.collection('subjects');
  const courses = db.collection('courses');

  // Auto-activate draft assessments to active so they show up for students
  assessments.updateMany({ status: 'DRAFT' }, { $set: { status: 'ACTIVE' } }).catch(err => {
    console.error('Failed to auto-activate draft assessments', err);
  });

  // POST compile and execute tests
  app.post('/api/compile', wrap(async (req, res) => {
    const { language, source, runTests, testCases, preview } = req.body;

    if (!source || source.trim() === '') {
      return res.json({ compiled: false, errors: '[ERROR] Please write some code before compiling.' });
    }

    // compile check only
    if (!runTests) {
      if (language === 'javascript' || language === 'js') {
        try {
          new vm.Script(source);
          return res.json({ compiled: true });
        } catch (err) {
          return res.json({ compiled: false, errors: err.message });
        }
      } else if (language === 'java') {
        let executableSource = source;
        let className = 'Solution';
        const classMatch = source.match(/class\s+([A-Za-z0-9_$]+)/);
        if (classMatch) {
          className = classMatch[1];
        } else {
          executableSource = `
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        try {
            ${source.trim().endsWith(";") || source.includes("System.out") ? source : `System.out.println(${source});`}
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
          `;
        }
        const tempDir = path.join(process.cwd(), 'temp_java_runs');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }
        const javaFilePath = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(javaFilePath, executableSource);

        exec(`javac "${javaFilePath}"`, (compileErr, stdout, stderr) => {
          try { fs.unlinkSync(javaFilePath); } catch (e) { }
          try { fs.unlinkSync(path.join(tempDir, `${className}.class`)); } catch (e) { }

          if (compileErr) {
            return res.json({ compiled: false, errors: stderr || stdout || compileErr.message });
          }
          return res.json({ compiled: true });
        });
        return;
      } else if (language === 'python' || language === 'py') {
        const tempDir = path.join(process.cwd(), 'temp_python_runs');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }
        const runId = Math.random().toString(36).substring(2, 9);
        const pythonFilePath = path.join(tempDir, `run_${runId}.py`);
        fs.writeFileSync(pythonFilePath, source);

        exec(`python -m py_compile "${pythonFilePath}"`, (compileErr, stdout, stderr) => {
          try {
            if (fs.existsSync(pythonFilePath)) fs.unlinkSync(pythonFilePath);
            const pycache = path.join(tempDir, '__pycache__');
            if (fs.existsSync(pycache)) {
              const files = fs.readdirSync(pycache);
              for (const file of files) fs.unlinkSync(path.join(pycache, file));
              fs.rmdirSync(pycache);
            }
          } catch (e) { }

          if (compileErr) {
            return res.json({ compiled: false, errors: stderr || stdout || compileErr.message });
          }
          return res.json({ compiled: true });
        });
        return;
      } else {
        return res.json({ compiled: true });
      }
    }

    // Execute test cases (with or without preview mode)
    const tcsToRun = preview ? (testCases && testCases.length > 0 ? [testCases[0]] : []) : (testCases || []);

    if (language === 'javascript' || language === 'js') {
      try {
        new vm.Script(source);
      } catch (err) {
        return res.json({ compiled: false, errors: 'Syntax Error: ' + err.message });
      }

      const results = [];
      for (const tc of tcsToRun) {
        try {
          const runRes = runJavascriptCode(source, tc.input);
          const cleanActual = runRes.output.trim().replace(/\r/g, '');
          const cleanExpected = (tc.output || '').trim().replace(/\r/g, '');
          results.push({
            input: tc.input,
            expected: tc.output,
            actual: runRes.output,
            passed: cleanActual === cleanExpected,
            hidden: tc.hidden || false
          });
        } catch (err) {
          results.push({
            input: tc.input,
            expected: tc.output,
            actual: `[ERROR] ${err.message}`,
            passed: false,
            hidden: tc.hidden || false
          });
        }
      }
      return res.json({ compiled: true, results });
    } else if (language === 'java') {
      try {
        const results = await executeJavaTestCases(source, tcsToRun);
        return res.json(results);
      } catch (err) {
        return res.json({ compiled: false, errors: err.message });
      }
    } else if (language === 'python' || language === 'py') {
      try {
        const results = await executePythonTestCases(source, tcsToRun);
        return res.json(results);
      } catch (err) {
        return res.json({ compiled: false, errors: err.message });
      }
    } else {
      const results = tcsToRun.map((tc, idx) => ({
        input: tc.input,
        expected: tc.output,
        actual: tc.output,
        passed: true,
        hidden: tc.hidden || false
      }));
      return res.json({ compiled: true, results });
    }
  }));

  // GET active assessments
  app.get('/api/assessments/active', wrap(async (req, res) => {
    const { collegeId, studentId } = req.query;
    const filter = { status: { $in: ['DRAFT', 'SCHEDULED', 'ACTIVE'] } };

    if (collegeId) {
      filter.$or = [
        { collegeId: collegeId },
        { collegeId: null },
        { collegeId: "" },
        { collegeId: { $exists: false } }
      ];
    }

    let rows = await assessments.find(filter).toArray();

    // Enrich with subject details
    for (const row of rows) {
      if (row.subjectId && !row.subject) {
        const subj = await subjects.findOne({ id: row.subjectId });
        if (subj) {
          row.subject = { id: subj.id, name: subj.name };
        }
      }
    }

    if (studentId) {
      const studentSessions = await sessions.find({
        studentId,
        status: { $in: ['SUBMITTED', 'FORCE_SUBMITTED', 'COMPLETED'] }
      }).toArray();
      const attemptedIds = new Set(studentSessions.map(s => s.assessmentId));
      rows = rows.filter(a => !attemptedIds.has(a.id));
    }

    res.json(rows);
  }));

  // GET assessments by creator
  app.get('/api/assessments/creator/:creatorId', wrap(async (req, res) => {
    const creatorId = req.params.creatorId;
    const rows = await assessments.find({ createdBy: creatorId }).toArray();
    for (const row of rows) {
      if (row.subjectId && !row.subject) {
        const subj = await subjects.findOne({ id: row.subjectId });
        if (subj) {
          row.subject = { id: subj.id, name: subj.name };
        }
      }
    }
    res.json(rows);
  }));

  // GET assessment by id
  app.get('/api/assessments/:id', wrap(async (req, res) => {
    const a = await assessments.findOne({ id: req.params.id });
    if (a && a.subjectId && !a.subject) {
      const subj = await subjects.findOne({ id: a.subjectId });
      if (subj) {
        a.subject = { id: subj.id, name: subj.name };
      }
    }
    res.json(a || {});
  }));

  // Create assessment
  app.post('/api/assessments', wrap(async (req, res) => {
    const creatorId = req.query.creatorId || req.body.creatorId || req.body.createdBy;
    const subjectId = req.query.subjectId || req.body.subjectId;
    const id = 'assess-' + Math.random().toString(36).slice(2, 9);
    // derive department/college from subject
    let departmentId = null, collegeId = null, subjectObj = null;
    if (subjectId) {
      const subj = await subjects.findOne({ id: subjectId });
      if (subj) {
        subjectObj = { id: subj.id, name: subj.name };
        const course = await courses.findOne({ id: subj.courseId });
        if (course) {
          departmentId = course.departmentId;
          const dept = await departments.findOne({ id: departmentId });
          if (dept) collegeId = dept.collegeId;
        }
      }
    }
    const rec = {
      ...req.body,
      id,
      createdBy: creatorId || req.body.createdBy,
      subjectId,
      subject: subjectObj,
      departmentId: req.body.departmentId || departmentId,
      collegeId: req.body.collegeId || collegeId,
      status: 'ACTIVE'
    };
    await assessments.insertOne(rec);
    res.json(rec);
  }));

  // PATCH status
  app.patch('/api/assessments/:id/status', wrap(async (req, res) => {
    const id = req.params.id;
    const status = req.query.status || (req.body && req.body.status);
    const update = { $set: { status } };
    if (req.body && req.body.startTime) update.$set.startTime = req.body.startTime;
    if (req.body && req.body.endTime) update.$set.endTime = req.body.endTime;
    if (req.body && req.body.duration) update.$set.duration = req.body.duration;
    await assessments.updateOne({ id }, update);
    const a = await assessments.findOne({ id });
    res.json(a);
  }));

  // Questions endpoints
  app.post('/api/questions', wrap(async (req, res) => {
    const id = 'q-' + Math.random().toString(36).slice(2, 9);
    const subjectId = req.query.subjectId || req.body.subjectId;
    const assessmentId = req.query.assessmentId || req.body.assessmentId;
    const rec = { 
      ...req.body, 
      id,
      subjectId,
      assessmentId
    };
    await questions.insertOne(rec);
    res.json(rec);
  }));

  app.put('/api/questions/:id', wrap(async (req, res) => {
    const id = req.params.id;
    await questions.updateOne({ id }, { $set: req.body });
    const q = await questions.findOne({ id });
    res.json(q);
  }));

  app.delete('/api/questions/:id', wrap(async (req, res) => {
    const id = req.params.id;
    await questions.deleteOne({ id });
    res.json({ message: "Question deleted successfully." });
  }));

  // POST upload and parse PDF, DOCX, or TXT
  app.post('/api/questions/upload-parse', upload.single('file'), wrap(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    const mimeType = req.file.mimetype;

    try {
      if (mimeType === 'text/plain') {
        text = req.file.buffer.toString('utf-8');
      } else if (mimeType === 'application/pdf') {
        const u8 = new Uint8Array(req.file.buffer);
        const parser = new PDFParse(u8);
        const pdfData = await parser.getText();
        text = pdfData.text;
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = docxData.value;
      } else {
        // fallback to text conversion
        text = req.file.buffer.toString('utf-8');
      }
    } catch (err) {
      console.error('File parsing failed:', err);
      return res.status(500).json({ error: 'Failed to extract text from file: ' + err.message });
    }

    const parsedQuestions = parseQuestionsFromText(text);
    res.json(parsedQuestions);
  }));

  // POST save questions in bulk
  app.post('/api/questions/bulk', wrap(async (req, res) => {
    const { subjectId, assessmentId, questions: questList } = req.body;
    if (!Array.isArray(questList) || questList.length === 0) {
      return res.status(400).json({ error: 'Questions list is empty' });
    }

    const insertedList = [];
    for (const q of questList) {
      const id = 'q-' + Math.random().toString(36).slice(2, 9);
      const rec = {
        id,
        subjectId,
        assessmentId: assessmentId || null,
        questionText: q.questionText,
        questionType: q.questionType || 'OBJECTIVE',
        difficulty: q.difficulty || 'MEDIUM',
        marks: Number(q.marks) || 1,
        optionsJson: q.optionsJson || null,
        correctAnswerJson: q.correctAnswerJson || '',
        testCasesJson: q.testCasesJson || null,
        programmingLanguage: q.programmingLanguage || null
      };
      await questions.insertOne(rec);
      insertedList.push(rec);
    }

    res.json({ message: `Successfully saved ${insertedList.length} questions.`, count: insertedList.length });
  }));

  app.get('/api/questions/assessment/:id', wrap(async (req, res) => {
    const rows = await questions.find({ assessmentId: req.params.id }).toArray();
    res.json(rows);
  }));

  app.get('/api/questions/subject/:id', wrap(async (req, res) => {
    const rows = await questions.find({ subjectId: req.params.id }).toArray();
    res.json(rows);
  }));

  app.get('/api/questions/bank/:subjectId', wrap(async (req, res) => {
    const rows = await questions.find({ 
      subjectId: req.params.subjectId, 
      $or: [
        { assessmentId: null },
        { assessmentId: "" },
        { assessmentId: { $exists: false } }
      ]
    }).toArray();
    res.json(rows);
  }));

  // Start session
  app.post('/api/exams/sessions/start', wrap(async (req, res) => {
    const studentId = req.query.studentId || req.body.studentId;
    const assessmentId = req.query.assessmentId || req.body.assessmentId;

    const existing = await sessions.findOne({ studentId, assessmentId });
    if (existing) {
      if (existing.status === 'IN_PROGRESS') {
        return res.json(existing);
      } else {
        return res.status(400).json({ error: 'You have already attempted this exam.' });
      }
    }

    const id = 'sess-' + Math.random().toString(36).slice(2, 9);
    const qs = await questions.find({ assessmentId }).toArray();
    const answers = qs.map(q => ({ id: 'ans-' + Math.random().toString(36).slice(2, 9), question: q, studentAnswerJson: null }));
    const session = { id, studentId, assessmentId, status: 'IN_PROGRESS', remainingTimeSeconds: 3600, answers, violationLogs: [], startedAt: new Date().toISOString() };
    await sessions.insertOne(session);
    res.json(session);
  }));

  // Save answer
  app.post('/api/exams/sessions/:id/answer', wrap(async (req, res) => {
    const sessionId = req.params.id;
    const questionId = req.query.questionId || req.body.questionId;
    const answerJson = req.body.answerJson;
    const session = await sessions.findOne({ id: sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    let ans = session.answers.find(a => String(a.question.id) === String(questionId) || a.question.id === questionId);
    if (!ans) {
      const q = await questions.findOne({ id: questionId });
      ans = { id: 'ans-' + Math.random().toString(36).slice(2, 9), question: q, studentAnswerJson: answerJson };
      session.answers.push(ans);
    } else {
      ans.studentAnswerJson = answerJson ?? ans.studentAnswerJson;
    }
    if (req.query.remainingTimeSeconds) session.remainingTimeSeconds = Number(req.query.remainingTimeSeconds);
    await sessions.updateOne({ id: sessionId }, { $set: { answers: session.answers, remainingTimeSeconds: session.remainingTimeSeconds } });
    res.json(ans);
  }));

  // Get answers for a session
  app.get('/api/exams/sessions/:id/answers', wrap(async (req, res) => {
    const sessionId = req.params.id;
    const session = await sessions.findOne({ id: sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session.answers || []);
  }));

  // Submit session with auto-evaluation
  app.post('/api/exams/sessions/:id/submit', wrap(async (req, res) => {
    const sessionId = req.params.id;
    const status = req.query.status || req.body.status || 'SUBMITTED';
    const session = await sessions.findOne({ id: sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.status = status;
    session.completedAt = new Date().toISOString();
    let totalObtained = 0;
    let totalMarks = 0;
    for (const ans of session.answers) {
      const q = ans.question;
      totalMarks += q.marks || 0;
      if (q.questionType === 'OBJECTIVE') {
        const correct = q.correctAnswerJson;
        if (ans.studentAnswerJson != null && String(ans.studentAnswerJson) === String(correct)) {
          ans.marksObtained = q.marks || 0;
          ans.isCorrect = true;
        } else {
          ans.marksObtained = 0;
          ans.isCorrect = false;
        }
      } else if (q.questionType === 'PROGRAMMING') {
        const studentCode = ans.studentAnswerJson || '';
        const testCases = q.testCasesJson ? JSON.parse(q.testCasesJson) : [];
        if (testCases.length > 0 && studentCode.trim() !== '') {
          const execRes = await executeTestCases(q.programmingLanguage || 'javascript', studentCode, testCases);
          if (execRes && execRes.compiled) {
            const passedAll = execRes.results.every(r => r.passed);
            if (passedAll && execRes.results.length > 0) {
              ans.marksObtained = q.marks || 0;
              ans.isCorrect = true;
            } else {
              ans.marksObtained = 0;
              ans.isCorrect = false;
            }
          } else {
            ans.marksObtained = 0;
            ans.isCorrect = false;
          }
        } else {
          ans.marksObtained = 0;
          ans.isCorrect = false;
        }
      }
      if (typeof ans.marksObtained === 'number') totalObtained += ans.marksObtained;
    }
    const result = { totalMarks, obtainedMarks: totalObtained, published: false };
    await sessions.updateOne({ id: sessionId }, { $set: { status: session.status, completedAt: session.completedAt, answers: session.answers, result } });
    res.json({ id: sessionId, status });
  }));

  // Faculty: list sessions for assessment
  app.get('/api/exams/sessions/assessment/:id', wrap(async (req, res) => {
    const assessmentId = req.params.id;
    const rows = await sessions.find({ assessmentId }).toArray();
    const out = await Promise.all(rows.map(async (s) => {
      const student = (await users.findOne({ id: s.studentId })) || { id: s.studentId, fullName: 'Student' };
      return {
        id: s.id,
        student,
        startedAt: s.startedAt,
        status: s.status,
        currentWarningCount: (s.violationLogs || []).length
      };
    }));
    res.json(out);
  }));

  // Grade an answer
  app.put('/api/exams/sessions/answers/:ansId/grade', wrap(async (req, res) => {
    const ansId = req.params.ansId;
    const { score, isCorrect, feedback } = req.query;
    // search across sessions
    const sess = await sessions.findOne({ 'answers.id': ansId });
    if (!sess) return res.status(404).json({ error: 'Answer not found' });
    const ans = sess.answers.find(a => String(a.id) === String(ansId));
    if (score != null) ans.marksObtained = Number(score);
    if (isCorrect != null) ans.isCorrect = (isCorrect === 'true' || isCorrect === true);
    if (feedback != null) ans.feedback = feedback;
    await sessions.updateOne({ id: sess.id }, { $set: { answers: sess.answers } });
    res.json(ans);
  }));

  // Publish result
  app.post('/api/results/session/:id', wrap(async (req, res) => {
    const sessionId = req.params.id;
    const sess = await sessions.findOne({ id: sessionId });
    if (!sess) return res.status(404).json({ error: 'Session not found' });
    let total = 0; let obtained = 0;
    for (const ans of sess.answers) { total += ans.question.marks || 0; if (typeof ans.marksObtained === 'number') obtained += ans.marksObtained; }
    const result = { totalMarks: total, obtainedMarks: obtained, published: true, publishedAt: new Date().toISOString() };
    await sessions.updateOne({ id: sessionId }, { $set: { result } });
    res.json(result);
  }));

  // Get all sessions for a student (enriched with assessment details)
  app.get('/api/exams/sessions/student/:studentId', wrap(async (req, res) => {
    const studentId = req.params.studentId;
    const rows = await sessions.find({ studentId }).toArray();
    const enriched = await Promise.all(rows.map(async (s) => {
      const assessment = await assessments.findOne({ id: s.assessmentId });
      return {
        ...s,
        assessment
      };
    }));
    res.json(enriched);
  }));

  // Get results for a student from completed sessions
  app.get('/api/results/student/:studentId', wrap(async (req, res) => {
    const studentId = req.params.studentId;
    const rows = await sessions.find({ studentId, result: { $exists: true } }).toArray();
    const out = await Promise.all(rows.map(async (s) => {
      const assessment = await assessments.findOne({ id: s.assessmentId });
      const totalMarks = s.result.totalMarks || (assessment ? assessment.totalMarks : 100);
      const obtainedMarks = s.result.obtainedMarks || 0;
      const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
      const status = percentage >= 50 ? 'PASSED' : 'FAILED';

      return {
        id: s.id,
        scoreObtained: obtainedMarks,
        totalScore: totalMarks,
        percentage: percentage,
        rank: 1,
        percentile: 90,
        status: status,
        assessment: {
          title: assessment ? assessment.title : 'Assessment',
          subject: { name: assessment ? assessment.subjectName || 'Subject' : 'Subject' }
        }
      };
    }));
    res.json(out);
  }));

  // DELETE assessment (cascades to questions and sessions)
  app.delete('/api/assessments/:id', wrap(async (req, res) => {
    const id = req.params.id;
    await assessments.deleteOne({ id });
    await questions.deleteMany({ assessmentId: id });
    await sessions.deleteMany({ assessmentId: id });
    res.json({ message: 'Deleted assessment and cascading data successfully.' });
  }));

  // DELETE question
  app.delete('/api/questions/:id', wrap(async (req, res) => {
    const id = req.params.id;
    await questions.deleteOne({ id });
    res.json({ message: 'Question deleted successfully.' });
  }));

  // Quick pass-through for other GETs (departments, courses, subjects, questions bank)
  app.get('/api/departments/college/:id', wrap(async (req, res) => { res.json(await departments.find({ collegeId: req.params.id }).toArray()); }));
  app.get('/api/courses/department/:id', wrap(async (req, res) => { res.json(await courses.find({ departmentId: req.params.id }).toArray()); }));
  app.get('/api/subjects/course/:id', wrap(async (req, res) => { res.json(await subjects.find({ courseId: req.params.id }).toArray()); }));
  app.get('/api/questions/bank/:id', wrap(async (req, res) => { res.json(await questions.find({ subjectId: req.params.id, assessmentId: { $exists: false } }).toArray()); }));

  app.listen(PORT, () => console.log('Mock API listening on http://localhost:' + PORT));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
