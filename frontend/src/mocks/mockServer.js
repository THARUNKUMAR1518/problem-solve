// Lightweight in-memory mock server to simulate backend behavior when using mock tokens
const MOCK_DB = {
  users: [
    { id: 'u-faculty-1', email: 'faculty@secureassess.com', fullName: 'Dr. Robert Johnson', role: 'FACULTY', collegeId: 'c-1', departmentId: 'd-CSE' },
    { id: 'u-student-1', email: 'student@secureassess.com', fullName: 'John Doe', role: 'STUDENT', collegeId: 'c-1', departmentId: 'd-IT' },
    { id: 'u-dev-student', email: 'devstudent@secureassess.com', fullName: 'Dev Student', role: 'STUDENT', collegeId: 'c-1', departmentId: 'd-IT' }
  ],
  colleges: [{ id: 'c-1', name: 'Apex Engineering College', code: 'AEC' }],
  departments: [
    { id: 'd-CSE', name: 'CSE', collegeId: 'c-1' },
    { id: 'd-AIML', name: 'AIML', collegeId: 'c-1' },
    { id: 'd-AIDS', name: 'AIDS', collegeId: 'c-1' },
    { id: 'd-ECE', name: 'ECE', collegeId: 'c-1' },
    { id: 'd-EEE', name: 'EEE', collegeId: 'c-1' },
    { id: 'd-MECH', name: 'MECH', collegeId: 'c-1' },
    { id: 'd-CIVIL', name: 'CIVIL', collegeId: 'c-1' },
    { id: 'd-IT', name: 'IT', collegeId: 'c-1' },
    { id: 'd-BIOTECH', name: 'BIOTECH', collegeId: 'c-1' },
    { id: 'd-CHEM', name: 'CHEM', collegeId: 'c-1' }
  ],
  courses: [],
  subjects: [],
  assessments: [],
  questions: [],
  sessions: []
};

// Persist mock DB to localStorage so data survives page reloads
const STORAGE_KEY = 'secureassess_mock_db_v1';
const loadMockDb = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.keys(MOCK_DB).forEach(k => {
          if (Array.isArray(MOCK_DB[k]) && Array.isArray(parsed[k])) {
            MOCK_DB[k] = parsed[k];
          } else if (parsed[k] !== undefined) {
            MOCK_DB[k] = parsed[k];
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  // Deduplicate loaded array data based on id
  Object.keys(MOCK_DB).forEach(k => {
    if (Array.isArray(MOCK_DB[k])) {
      const seen = new Set();
      MOCK_DB[k] = MOCK_DB[k].filter(item => {
        if (!item || !item.id) return true;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    }
  });

  // Clean up duplicate student sessions in localStorage: keep only the latest one per student-assessment pair
  if (Array.isArray(MOCK_DB.sessions)) {
    const sessionGroups = {};
    MOCK_DB.sessions.forEach(s => {
      const key = `${s.studentId}_${s.assessmentId}`;
      if (!sessionGroups[key]) sessionGroups[key] = [];
      sessionGroups[key].push(s);
    });

    const cleanSessions = [];
    Object.keys(sessionGroups).forEach(key => {
      const group = sessionGroups[key];
      if (group.length > 1) {
        group.sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0));
      }
      cleanSessions.push(group[0]);
    });
    MOCK_DB.sessions = cleanSessions;
  }

  // Auto-activate draft assessments to active so they show up for students
  if (Array.isArray(MOCK_DB.assessments)) {
    MOCK_DB.assessments.forEach(a => {
      if (a.status === 'DRAFT') {
        a.status = 'ACTIVE';
      }
    });
  }

  saveMockDb();
};

const saveMockDb = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DB));
    }
  } catch (e) {
    // ignore
  }
};

// initialize from storage
loadMockDb();

// Simple id generator
const genId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const buildAuthProfile = (email) => {
  const normalized = String(email || '').toLowerCase();

  if (normalized.includes('faculty')) {
    return { role: 'FACULTY', fullName: 'Dr. Robert Johnson', userId: 'u-faculty-1', collegeId: 'c-1', departmentId: 'd-CSE' };
  }

  if (normalized.includes('admin') || normalized.includes('college')) {
    return { role: 'COLLEGE_ADMIN', fullName: 'Test College Admin', userId: 'u-college-admin-1', collegeId: 'c-1', departmentId: 'd-CSE' };
  }

  if (normalized.includes('super')) {
    return { role: 'SUPER_ADMIN', fullName: 'Test Super Admin', userId: 'u-super-admin-1', collegeId: 'c-1', departmentId: 'd-CSE' };
  }

  if (normalized.includes('jane')) {
    return { role: 'STUDENT', fullName: 'Jane Smith', userId: 'u-jane-student', collegeId: 'c-1', departmentId: 'd-IT' };
  }

  if (normalized.includes('dev')) {
    return { role: 'STUDENT', fullName: 'Dev Student', userId: 'u-dev-student', collegeId: 'c-1', departmentId: 'd-IT' };
  }

  return { role: 'STUDENT', fullName: 'John Doe', userId: 'u-student-1', collegeId: 'c-1', departmentId: 'd-IT' };
};

const buildAuthResponse = (email) => {
  const profile = buildAuthProfile(email);
  return {
    accessToken: 'MOCK-ACCESS-TOKEN',
    refreshToken: 'MOCK-REFRESH-TOKEN',
    email,
    fullName: profile.fullName,
    role: profile.role,
    userId: profile.userId,
    collegeId: profile.collegeId,
    departmentId: profile.departmentId,
  };
};

const seedIfEmpty = (arr, ...items) => {
  items.forEach(item => {
    if (!arr.find(x => x.id === item.id)) {
      arr.push(item);
    }
  });
};

// Seed a default course/subject for CSE
seedIfEmpty(MOCK_DB.courses, { id: 'course-1', name: 'Bachelor of Technology', departmentId: 'd-CSE' });
seedIfEmpty(MOCK_DB.subjects, { id: 'subj-ds', name: 'Data Structures and Algorithms', courseId: 'course-1' });

// Seed a default course/subject for IT (matching student@secureassess.com)
seedIfEmpty(MOCK_DB.courses, { id: 'course-it', name: 'Bachelor of Technology (IT)', departmentId: 'd-IT' });
seedIfEmpty(MOCK_DB.subjects, { id: 'subj-ds-it', name: 'Data Structures and Algorithms', courseId: 'course-it' });

// Seed active assessment for d-IT students
seedIfEmpty(MOCK_DB.assessments, {
  id: 'demo-exam-1',
  title: 'Data Structures Midterm',
  subjectId: 'subj-ds-it',
  subject: { id: 'subj-ds-it', name: 'Data Structures and Algorithms' },
  durationMinutes: 90,
  passingMarks: 40,
  totalMarks: 100,
  status: 'ACTIVE',
  collegeId: 'c-1',
  departmentId: 'd-IT',
  createdBy: 'u-faculty-1',
  maxWarnings: 3
}, {
  id: 'demo-exam-2',
  title: 'Java Programming & OOP Quiz',
  subjectId: 'subj-ds-it',
  subject: { id: 'subj-ds-it', name: 'Data Structures and Algorithms' },
  durationMinutes: 45,
  passingMarks: 20,
  totalMarks: 50,
  status: 'ACTIVE',
  collegeId: 'c-1',
  departmentId: 'd-IT',
  createdBy: 'u-faculty-1',
  maxWarnings: 3
});

// Seed questions for demo-exam-1 & demo-exam-2
seedIfEmpty(MOCK_DB.questions,
  {
    id: 'q-101',
    assessmentId: 'demo-exam-1',
    subjectId: 'subj-ds-it',
    questionText: "What is the average time complexity of searching in a balanced Binary Search Tree (BST)?",
    questionType: "OBJECTIVE",
    difficulty: "EASY",
    marks: 30,
    optionsJson: JSON.stringify(["O(N)", "O(log N)", "O(N log N)", "O(1)"]),
    correctAnswerJson: "1"
  },
  {
    id: 'q-102',
    assessmentId: 'demo-exam-1',
    subjectId: 'subj-ds-it',
    questionText: "Explain the difference between a Stack and a Queue in terms of insert/remove ordering.",
    questionType: "SHORT_ANSWER",
    difficulty: "MEDIUM",
    marks: 30,
    correctAnswerJson: "FIFO, LIFO, linear, push, pop"
  },
  {
    id: 'q-103',
    assessmentId: 'demo-exam-1',
    subjectId: 'subj-ds-it',
    questionText: "Write a function in Javascript that reverses a singly linked list.",
    questionType: "PROGRAMMING",
    programmingLanguage: "javascript",
    difficulty: "HARD",
    marks: 40,
    correctAnswerJson: "function reverse(head) { ... }",
    testCasesJson: JSON.stringify([
      { input: "[1, 2, 3]", output: "[3, 2, 1]" },
      { input: "[5]", output: "[5]" },
      { input: "[]", output: "[]" },
      { input: "[10, 20, 30, 40]", output: "[40, 30, 20, 10]" }
    ])
  },
  {
    id: 'q-201',
    assessmentId: 'demo-exam-2',
    subjectId: 'subj-ds-it',
    questionText: "Which of the following is NOT an OOP feature in Java?",
    questionType: "OBJECTIVE",
    difficulty: "EASY",
    marks: 20,
    optionsJson: JSON.stringify(["Inheritance", "Polymorphism", "Compilation", "Encapsulation"]),
    correctAnswerJson: "2"
  },
  {
    id: 'q-202',
    assessmentId: 'demo-exam-2',
    subjectId: 'subj-ds-it',
    questionText: "Write a function in Java/Javascript that returns the factorial of a given number.",
    questionType: "PROGRAMMING",
    programmingLanguage: "javascript",
    difficulty: "MEDIUM",
    marks: 30,
    correctAnswerJson: "function factorial(n) { ... }",
    testCasesJson: JSON.stringify([
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "3", output: "6" },
      { input: "10", output: "3628800" },
      { input: "1", output: "1" }
    ])
  }
);

const runMockCompilation = (language, source, testCases, preview = false) => {
  const tcsToRun = preview ? (testCases.length > 0 ? [testCases[0]] : []) : testCases;

  const runJavascript = (src, inputStr) => {
    const logs = [];
    const localConsole = {
      log: (...args) => {
        logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      }
    };

    const fnMatch = src.match(/function\s+([a-zA-Z0-9_$]+)/) || src.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*/);
    const fnName = fnMatch ? fnMatch[1] : null;

    if (fnName) {
      const userScope = {};
      new Function('console', `
        ${src}
        userScope.run = ${fnName};
      `)(localConsole);

      const fn = userScope.run;
      let arg;
      try {
        arg = JSON.parse(inputStr);
      } catch (e) {
        if (!isNaN(inputStr) && inputStr.trim() !== '') arg = Number(inputStr);
        else arg = inputStr;
      }

      const isLinkedList = src.toLowerCase().includes('linked') || src.toLowerCase().includes('head');
      if (isLinkedList && Array.isArray(arg)) {
        const arrayToLL = (arr) => {
          if (!arr || arr.length === 0) return null;
          const h = { val: arr[0], next: null };
          let c = h;
          for (let i = 1; i < arr.length; i++) {
            c.next = { val: arr[i], next: null };
            c = c.next;
          }
          return h;
        };
        arg = arrayToLL(arg);
      }

      let res = fn(arg);

      if (isLinkedList && res && (res.val !== undefined || res.next !== undefined)) {
        const llToArr = (h) => {
          const arr = [];
          let c = h;
          while (c) {
            arr.push(c.val !== undefined ? c.val : c.value);
            c = c.next;
          }
          return arr;
        };
        res = llToArr(res);
      }

      let outputText = "";
      if (res !== undefined) {
        outputText = typeof res === 'object' ? JSON.stringify(res) : String(res);
      } else if (logs.length > 0) {
        outputText = logs.join('\n');
      }
      return { output: outputText, logs: logs.join('\n') };
    } else {
      // Script-mode execution
      const userScript = new Function('console', `
        return (function() {
          ${src}
        })();
      `);
      const res = userScript(localConsole);
      let outputText = "";
      if (res !== undefined) {
        outputText = typeof res === 'object' ? JSON.stringify(res) : String(res);
      } else if (logs.length > 0) {
        outputText = logs.join('\n');
      }
      return { output: outputText, logs: logs.join('\n') };
    }
  };

  if (language === 'javascript' || language === 'js') {
    try {
      const results = tcsToRun.map((tc, idx) => {
        try {
          const runRes = runJavascript(source, tc.input);
          const actual = runRes.output.trim();
          const expected = (tc.output || '').trim();
          return {
            input: tc.input,
            expected: tc.output,
            actual: runRes.output,
            passed: actual === expected,
            hidden: idx >= 2
          };
        } catch (e) {
          return {
            input: tc.input,
            expected: tc.output,
            actual: '[ERROR] ' + e.message,
            passed: false,
            hidden: idx >= 2
          };
        }
      });
      return { compiled: true, results };
    } catch (e) {
      return { compiled: false, errors: '[MOCK] Javascript Error: ' + e.message };
    }
  } else if (language === 'python' || language === 'py') {
    try {
      let executableJS = source
        .replace(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/g, 'function $1($2) {')
        .replace(/print\(([^)]+)\)/g, 'console.log($1)')
        .replace(/elif\s+/g, 'else if ')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null');

      if (!source.includes('def ') && !source.includes('print(')) {
        executableJS = 'console.log(' + source.trim() + ')';
      }

      const results = tcsToRun.map((tc, idx) => {
        try {
          const runRes = runJavascript(executableJS, tc.input);
          const actual = runRes.output.trim();
          const expected = (tc.output || '').trim();
          return {
            input: tc.input,
            expected: tc.output,
            actual: runRes.output,
            passed: actual === expected,
            hidden: idx >= 2
          };
        } catch (e) {
          return {
            input: tc.input,
            expected: tc.output,
            actual: '[ERROR] ' + e.message,
            passed: false,
            hidden: idx >= 2
          };
        }
      });
      return { compiled: true, results };
    } catch (e) {
      return { compiled: false, errors: '[MOCK] Python Translation Error: ' + e.message };
    }
  } else if (language === 'java') {
    try {
      let executableJS = source
        .replace(/package\s+[a-zA-Z0-9_.]+;/g, '')
        .replace(/import\s+[a-zA-Z0-9_.]+;/g, '')
        .replace(/\b(public|private|protected|static|final)\b/g, '')
        .replace(/System\.out\.print(?:ln)?\(([^)]*)\);?/g, 'console.log($1)')
        .replace(/class\s+[a-zA-Z0-9_$]+\s*\{[^]*?void\s+main\s*\([^)]*\)\s*\{([^]*?)\}\s*\}/g, '$1')
        .replace(/\b(int|double|float|String|boolean|void|char|long|short|byte)\b/g, 'var')
        .replace(/new\s+int\s*\[\s*\]\s*\{([^}]*)\}/g, '[$1]')
        .replace(/new\s+String\s*\[\s*\]\s*\{([^}]*)\}/g, '[$1]');

      if (!source.includes('class ') && !source.includes('System.out.print')) {
        executableJS = 'console.log(' + source.trim().replace(/;$/, '') + ')';
      }

      const results = tcsToRun.map((tc, idx) => {
        try {
          const runRes = runJavascript(executableJS, tc.input);
          const actual = runRes.output.trim();
          const expected = (tc.output || '').trim();
          return {
            input: tc.input,
            expected: tc.output,
            actual: runRes.output,
            passed: actual === expected,
            hidden: idx >= 2
          };
        } catch (e) {
          return {
            input: tc.input,
            expected: tc.output,
            actual: '[ERROR] ' + e.message,
            passed: false,
            hidden: idx >= 2
          };
        }
      });
      return { compiled: true, results };
    } catch (e) {
      return { compiled: false, errors: '[MOCK] Java Translation Error: ' + e.message };
    }
  } else {
    const results = tcsToRun.map((tc, idx) => ({
      input: tc.input,
      expected: tc.output,
      actual: tc.output,
      passed: true,
      hidden: idx >= 2
    }));
    return { compiled: true, results };
  }
};

const mockServer = {
  get: async (url) => {
    // Departments by college
    if (/^\/departments\/college\/.+/.test(url)) {
      const collegeId = url.split('/').pop();
      return MOCK_DB.departments.filter(d => d.collegeId === collegeId);
    }
    if (/^\/courses\/department\/.+/.test(url)) {
      const depId = url.split('/').pop();
      return MOCK_DB.courses.filter(c => c.departmentId === depId);
    }
    if (/^\/subjects\/course\/.+/.test(url)) {
      const courseId = url.split('/').pop();
      return MOCK_DB.subjects.filter(s => s.courseId === courseId);
    }
    if (url.startsWith('/assessments/active')) {
      const qs = new URLSearchParams((url.split('?')[1]) || '');
      const collegeId = qs.get('collegeId');
      const studentId = qs.get('studentId');
      let active = MOCK_DB.assessments.filter(a => a.status === 'SCHEDULED' || a.status === 'ACTIVE' || a.status === 'DRAFT');
      if (collegeId) active = active.filter(a => a.collegeId === collegeId || !a.collegeId);

      if (studentId) {
        active = active.filter(a => {
          const hasCompletedSession = MOCK_DB.sessions.some(s =>
            s.studentId === studentId &&
            s.assessmentId === a.id &&
            (s.status === 'SUBMITTED' || s.status === 'FORCE_SUBMITTED' || s.status === 'COMPLETED')
          );
          return !hasCompletedSession;
        });
      }
      return active.length > 0 ? active : [];
    }
    if (url.startsWith('/assessments/creator/')) {
      const creatorId = url.split('/').pop();
      return MOCK_DB.assessments.filter(a => a.createdBy === creatorId);
    }
    if (url.startsWith('/assessments/')) {
      const id = url.split('/').pop();
      return MOCK_DB.assessments.find(a => a.id === id);
    }
    if (url.startsWith('/assessments')) {
      return MOCK_DB.assessments;
    }
    if (url.startsWith('/questions/assessment/')) {
      const assessmentId = url.split('/').pop();
      return MOCK_DB.questions.filter(q => q.assessmentId === assessmentId);
    }
    if (url.startsWith('/assessments/creator/')) {
      // already exists above but ensure creator queries work after reload
      const creatorId = url.split('/').pop();
      return MOCK_DB.assessments.filter(a => a.createdBy === creatorId);
    }
    if (url.startsWith('/questions/bank/')) {
      const subjId = url.split('/').pop();
      return MOCK_DB.questions.filter(q => q.subjectId === subjId && !q.assessmentId);
    }
    if (url.startsWith('/questions/subject/')) {
      const subjId = url.split('/').pop();
      return MOCK_DB.questions.filter(q => q.subjectId === subjId);
    }
    if (url.startsWith('/exams/sessions/') && url.endsWith('/answers')) {
      const sessionId = url.split('/')[3];
      const answers = MOCK_DB.sessions.find(s => s.id === sessionId)?.answers || [];
      return answers;
    }

    if (url.startsWith('/exams/sessions/assessment/')) {
      const assessmentId = url.split('/').pop();
      const sessions = MOCK_DB.sessions.filter(s => String(s.assessmentId) === String(assessmentId));
      // enrich sessions with student profile and warning count
      return sessions.map(s => ({
        id: s.id,
        student: MOCK_DB.users.find(u => u.id === s.studentId) || { id: s.studentId, fullName: 'Student' },
        startedAt: s.startedAt,
        status: s.status,
        currentWarningCount: (s.violationLogs || []).length
      }));
    }

    if (url.startsWith('/exams/sessions/student/')) {
      const studentId = url.split('/').pop();
      const studentSessions = MOCK_DB.sessions.filter(s => s.studentId === studentId);
      return studentSessions.map(s => {
        const assessment = MOCK_DB.assessments.find(a => a.id === s.assessmentId);
        return {
          ...s,
          assessment
        };
      });
    }

    // Results endpoint handling
    if (url.startsWith('/results/student/')) {
      const studentId = url.split('/').pop();
      return [
        {
          id: 'mock-result-999',
          assessmentId: 'demo-exam-1',
          assessment: {
            title: 'Data Structures Midterm',
            subject: { name: 'Data Structures and Algorithms' }
          },
          scoreObtained: 35.0,
          totalScore: 50.0,
          percentage: 70.0,
          percentile: 88.0,
          rank: 3,
          status: 'PASSED'
        }
      ];
    }
    if (url.startsWith('/results/') && url.endsWith('/pdf')) {
      return new Blob(["Mock PDF Content"], { type: "application/pdf" });
    }
    if (url.startsWith('/results/')) {
      const resultId = url.split('/').pop();
      if (resultId === 'mock-result-999') {
        return {
          id: 'mock-result-999',
          scoreObtained: 35.0,
          totalScore: 50.0,
          percentage: 70.0,
          percentile: 88.0,
          rank: 3,
          status: 'PASSED',
          assessment: { title: 'Data Structures Midterm' },
          examSession: { id: 'mock-session-999', currentWarningCount: 1 }
        };
      }
    }

    return {};
  },

  post: async (url, data) => {
    const path = url.split('?')[0];
    const qs = new URLSearchParams((url.split('?')[1]) || '');

    if (path === '/auth/login') {
      const email = data?.email || '';
      const password = data?.password || '';
      const acceptablePasswords = new Set(['test@123', 'student123', 'faculty123']);
      if (!acceptablePasswords.has(password)) {
        throw new Error('Invalid credentials');
      }
      return buildAuthResponse(email);
    }

    // Compile/Execute mock endpoint: POST /compile
    if (path === '/compile') {
      const language = data.language || 'java';
      const source = data.source || '';
      const testCases = data.testCases || [];
      const runTests = data.runTests === true;

      // If runTests === false, check for syntax errors
      if (!runTests) {
        if (language === 'javascript' || language === 'js') {
          try {
            new Function(source);
            return { compiled: true };
          } catch (e) {
            return { compiled: false, errors: '[MOCK] Syntax Error: ' + e.message };
          }
        }
        return { compiled: true };
      }

      const preview = data.preview === true;
      return runMockCompilation(language, source, testCases, preview);
    }

    if (path === '/auth/refresh') {
      const refreshToken = data?.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }
      return {
        accessToken: 'MOCK-ACCESS-TOKEN',
        refreshToken,
      };
    }

    if (path === '/auth/forgot-password') {
      return { message: 'Password reset instructions sent.' };
    }

    if (path === '/auth/reset-password') {
      return { message: 'Password reset successful.' };
    }

    if (path === '/auth/verify-email' || path === '/auth/request-verification') {
      return { message: 'Verification accepted.' };
    }

    if (url.startsWith('/assessments')) {
      const id = genId('assess');
      const creatorId = qs.get('creatorId') || data?.creatorId;
      const subjectId = qs.get('subjectId') || data?.subjectId;
      // derive departmentId and collegeId from subject->course->department
      let departmentId = null;
      let collegeId = null;
      let subj = null;
      if (subjectId) {
        subj = MOCK_DB.subjects.find(s => s.id === subjectId);
        if (subj) {
          const course = MOCK_DB.courses.find(c => c.id === subj.courseId);
          if (course) {
            departmentId = course.departmentId;
            const dept = MOCK_DB.departments.find(d => d.id === departmentId);
            if (dept) collegeId = dept.collegeId;
          }
        }
      }
      const rec = { ...data, id, createdBy: creatorId, subject: { id: subjectId, name: subj ? subj.name : 'Subject' }, subjectId: subjectId, departmentId, collegeId, status: 'ACTIVE' };
      MOCK_DB.assessments.push(rec);
      saveMockDb();
      return rec;
    }
    if (url.startsWith('/questions')) {
      const id = genId('q');
      const subjectId = qs.get('subjectId') || data.subjectId;
      const assessmentId = qs.get('assessmentId') || data.assessmentId;
      const rec = { ...data, id, subjectId, assessmentId };
      MOCK_DB.questions.push(rec);
      saveMockDb();
      return rec;
    }
    // Start session: allow query params or body
    if (path.endsWith('/start')) {
      const studentId = qs.get('studentId') || data?.studentId;
      const assessmentId = qs.get('assessmentId') || data?.assessmentId;

      const existing = MOCK_DB.sessions.find(s => s.studentId === studentId && s.assessmentId === assessmentId);
      if (existing) {
        if (existing.status === 'IN_PROGRESS') {
          return existing;
        } else {
          return { error: 'You have already attempted this exam.' };
        }
      }

      const id = genId('sess');
      const session = { id, studentId, assessmentId, status: 'IN_PROGRESS', remainingTimeSeconds: 3600, answers: [], violationLogs: [], startedAt: new Date().toISOString() };
      // create answers for questions of assessment
      const questions = MOCK_DB.questions.filter(q => q.assessmentId === assessmentId);
      for (const q of questions) {
        const ans = { id: genId('ans'), question: q, studentAnswerJson: null, examSession: { id } };
        session.answers.push(ans);
      }
      MOCK_DB.sessions.push(session);
      saveMockDb();
      return session;
    }

    // Save answer to session: POST /exams/sessions/{id}/answer?questionId=... with body { answerJson }
    if (path.match(/^\/exams\/sessions\/[^\/]+\/answer$/)) {
      const parts = path.split('/');
      const sessionId = parts[3];
      const questionId = qs.get('questionId');
      const session = MOCK_DB.sessions.find(s => s.id === sessionId);
      if (!session) return { error: 'Session not found' };
      // find existing answer
      let ans = session.answers.find(a => String(a.question.id) === String(questionId) || a.question.id === questionId);
      if (!ans) {
        const q = MOCK_DB.questions.find(q => String(q.id) === String(questionId));
        ans = { id: genId('ans'), question: q, studentAnswerJson: data.answerJson || null, examSession: { id: sessionId } };
        session.answers.push(ans);
      } else {
        ans.studentAnswerJson = data.answerJson || ans.studentAnswerJson;
      }
      if (qs.get('remainingTimeSeconds')) {
        session.remainingTimeSeconds = Number(qs.get('remainingTimeSeconds'));
      }
      saveMockDb();
      return ans;
    }

    // Submit session: POST /exams/sessions/{id}/submit?status=SUBMITTED
    if (path.match(/^\/exams\/sessions\/[^\/]+\/submit$/)) {
      const parts = path.split('/');
      const sessionId = parts[3];
      const status = qs.get('status') || 'SUBMITTED';
      const session = MOCK_DB.sessions.find(s => s.id === sessionId);
      if (session) {
        session.status = status;
        session.completedAt = new Date().toISOString();
        // Auto-evaluate objective questions where possible
        let totalObtained = 0;
        let totalMarks = 0;
        for (const ans of session.answers) {
          const q = ans.question;
          totalMarks += q.marks || 0;
          // Objective auto-mark
          if (q.questionType === 'OBJECTIVE') {
            try {
              const correct = q.correctAnswerJson;
              // studentAnswerJson may be index or value
              if (ans.studentAnswerJson != null && String(ans.studentAnswerJson) === String(correct)) {
                ans.marksObtained = q.marks || 0;
                ans.isCorrect = true;
              } else {
                ans.marksObtained = 0;
                ans.isCorrect = false;
              }
            } catch (e) {
              ans.marksObtained = 0;
              ans.isCorrect = false;
            }
          } else if (q.questionType === 'PROGRAMMING') {
            const studentCode = ans.studentAnswerJson || '';
            const testCases = q.testCasesJson ? JSON.parse(q.testCasesJson) : [];
            if (testCases.length > 0 && studentCode.trim() !== '') {
              const execRes = runMockCompilation(q.programmingLanguage || 'javascript', studentCode, testCases);
              if (execRes.compiled) {
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
          } else {
            // subjective: leave marksObtained as null until manual grading
            if (ans.marksObtained == null) ans.marksObtained = null;
          }
          if (typeof ans.marksObtained === 'number') totalObtained += ans.marksObtained;
        }
        session.result = { totalMarks, obtainedMarks: totalObtained, published: false };
        saveMockDb();
      }
      return { id: sessionId, status };
    }

    // Violation logging: POST /exams/sessions/{id}/violation
    if (path.match(/^\/exams\/sessions\/[^\/]+\/violation$/)) {
      const parts = path.split('/');
      const sessionId = parts[3];
      const session = MOCK_DB.sessions.find(s => s.id === sessionId);
      if (!session) return { error: 'Session not found' };
      const log = {
        id: Date.now(),
        violationType: data.violationType || 'UNKNOWN',
        warningIncrement: data.warningWeight || 1,
        description: data.description || data.violation || '',
        screenshotUrl: data.screenshotUrl || '',
        timestamp: new Date().toISOString()
      };
      session.violationLogs = session.violationLogs || [];
      session.violationLogs.unshift(log);
      saveMockDb();
      return log;
    }

    // Publish result: POST /results/session/{id}
    if (path.match(/^\/results\/session\/[^\/]+$/)) {
      const parts = path.split('/');
      const sessionId = parts[3];
      const session = MOCK_DB.sessions.find(s => s.id === sessionId);
      if (!session) return { error: 'Session not found' };
      // compute totals from answers
      let total = 0;
      let obtained = 0;
      for (const ans of session.answers) {
        const q = ans.question;
        total += q.marks || 0;
        if (typeof ans.marksObtained === 'number') obtained += ans.marksObtained;
      }
      session.result = session.result || { totalMarks: total, obtainedMarks: obtained, published: false };
      session.result.published = true;
      session.result.publishedAt = new Date().toISOString();
      saveMockDb();
      return session.result;
    }


    return data;
  },

  put: async (url, data) => {
    // Grade an answer: PUT /exams/sessions/answers/{ansId}/grade?score=...&isCorrect=...&feedback=...
    if (url.startsWith('/exams/sessions/answers/')) {
      const parts = url.split('/');
      const ansId = parts[3];
      const qs = new URLSearchParams((url.split('?')[1]) || '');
      const score = qs.get('score');
      const isCorrect = qs.get('isCorrect');
      const feedback = qs.get('feedback');
      // find answer across sessions
      for (const sess of MOCK_DB.sessions) {
        const ans = sess.answers.find(a => String(a.id) === String(ansId));
        if (ans) {
          if (score != null) ans.marksObtained = Number(score);
          if (isCorrect != null) ans.isCorrect = (isCorrect === 'true' || isCorrect === true);
          if (feedback != null) ans.feedback = feedback;
          saveMockDb();
          return ans;
        }
      }
    }
    if (url.startsWith('/questions/')) {
      const id = url.split('/').pop();
      const idx = MOCK_DB.questions.findIndex(q => q.id === id);
      if (idx >= 0) {
        MOCK_DB.questions[idx] = { ...MOCK_DB.questions[idx], ...data };
        return MOCK_DB.questions[idx];
      }
    }
    if (url.startsWith('/assessments/')) {
      const id = url.split('/').pop();
      const idx = MOCK_DB.assessments.findIndex(a => a.id === id);
      if (idx >= 0) {
        MOCK_DB.assessments[idx] = { ...MOCK_DB.assessments[idx], ...data };
        return MOCK_DB.assessments[idx];
      }
    }
    return data;
  },

  // GET sessions for an assessment (faculty view)
  // e.g. GET /exams/sessions/assessment/{assessmentId}
  // This is handled below in `get`.

  patch: async (url, data) => {
    // handle status updates like /assessments/{id}/status?status=...
    if (url.startsWith('/assessments/')) {
      const parts = url.split('/');
      const id = parts[2];
      const qs = new URLSearchParams((url.split('?')[1]) || '');
      const status = qs.get('status') || data?.status;
      const idx = MOCK_DB.assessments.findIndex(a => a.id === id);
      if (idx >= 0) {
        MOCK_DB.assessments[idx] = { ...MOCK_DB.assessments[idx], status };
        // if scheduling includes start/end times in payload, copy them too
        if (data?.startTime) MOCK_DB.assessments[idx].startTime = data.startTime;
        if (data?.endTime) MOCK_DB.assessments[idx].endTime = data.endTime;
        return MOCK_DB.assessments[idx];
      }
      return { error: 'Assessment not found' };
    }
    return data;
  },

  delete: async (url) => {
    if (url.startsWith('/questions/')) {
      const id = url.split('/').pop();
      MOCK_DB.questions = MOCK_DB.questions.filter(q => q.id !== id);
      saveMockDb();
      return { message: 'Deleted' };
    }
    if (url.startsWith('/assessments/')) {
      const id = url.split('/').pop();
      MOCK_DB.assessments = MOCK_DB.assessments.filter(a => a.id !== id);
      MOCK_DB.questions = MOCK_DB.questions.filter(q => q.assessmentId !== id);
      MOCK_DB.sessions = MOCK_DB.sessions.filter(s => s.assessmentId !== id);
      saveMockDb();
      return { message: 'Deleted' };
    }
    return { message: 'OK' };
  }
};

export default mockServer;
