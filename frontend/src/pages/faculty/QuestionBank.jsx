import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Edit3, Trash2, HelpCircle, AlertCircle, FileText
} from 'lucide-react';

const QuestionBank = () => {
  const { user } = useAuth();
  const collegeId = user?.collegeId;

  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // Question Form Fields
  const [formText, setFormText] = useState('');
  const [formType, setFormType] = useState('OBJECTIVE');
  const [formDifficulty, setFormDifficulty] = useState('MEDIUM');
  const [formMarks, setFormMarks] = useState(1);
  const [formOptions, setFormOptions] = useState(['', '', '', '']);
  const [formCorrectMCQ, setFormCorrectMCQ] = useState(0);
  const [formCorrectText, setFormCorrectText] = useState('');
  const [formLang, setFormLang] = useState('java');
  const [formTestCases, setFormTestCases] = useState([{ input: '', output: '' }]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load cascading filters
  useEffect(() => {
    const loadCascading = async () => {
      try {
        const deptRes = await api.get(`/departments/college/${collegeId}`);
        setDepartments(deptRes.data);
        if (deptRes.data.length > 0) {
          setSelectedDeptId(deptRes.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch departments.');
      }
    };
    loadCascading();
  }, [collegeId]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!selectedDeptId) return;
      try {
        const courseRes = await api.get(`/courses/department/${selectedDeptId}`);
        setCourses(courseRes.data);
        if (courseRes.data.length > 0) {
          setSelectedCourseId(courseRes.data[0].id);
        } else {
          setSelectedCourseId('');
          setSubjects([]);
          setSelectedSubjectId('');
        }
      } catch (err) {
        setCourses([]);
        setSelectedCourseId('');
        setSubjects([]);
        setSelectedSubjectId('');
      }
    };
    loadCourses();
  }, [selectedDeptId]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!selectedCourseId) return;
      try {
        const subRes = await api.get(`/subjects/course/${selectedCourseId}`);
        setSubjects(subRes.data);
        if (subRes.data.length > 0) {
          setSelectedSubjectId(subRes.data[0].id);
        } else {
          setSelectedSubjectId('');
        }
      } catch (err) {
        setSubjects([]);
        setSelectedSubjectId('');
      }
    };
    loadSubjects();
  }, [selectedCourseId]);

  // Load Bank Questions when Subject changes
  const fetchBankQuestions = async () => {
    if (!selectedSubjectId) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/questions/bank/${selectedSubjectId}`);
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load question bank.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankQuestions();
  }, [selectedSubjectId]);

  const handleOpenModal = (q = null) => {
    setSelectedQuestion(q);
    if (q) {
      setFormText(q.questionText);
      setFormType(q.questionType);
      setFormDifficulty(q.difficulty);
      setFormMarks(q.marks);
      
      if (q.questionType === 'OBJECTIVE') {
        try {
          const opts = JSON.parse(q.optionsJson);
          setFormOptions(opts.length > 0 ? opts : ['', '', '', '']);
          setFormCorrectMCQ(Number(q.correctAnswerJson) || 0);
        } catch {
          setFormOptions(['', '', '', '']);
          setFormCorrectMCQ(0);
        }
      } else if (q.questionType === 'PROGRAMMING') {
        setFormLang(q.programmingLanguage || 'java');
        setFormCorrectText(q.correctAnswerJson || '');
        try {
          const tc = JSON.parse(q.testCasesJson);
          setFormTestCases(tc.length > 0 ? tc : [{ input: '', output: '' }]);
        } catch {
          setFormTestCases([{ input: '', output: '' }]);
        }
      } else {
        setFormCorrectText(q.correctAnswerJson || '');
      }
    } else {
      setFormText('');
      setFormType('OBJECTIVE');
      setFormDifficulty('MEDIUM');
      setFormMarks(1);
      setFormOptions(['', '', '', '']);
      setFormCorrectMCQ(0);
      setFormCorrectText('');
      setFormLang('java');
      setFormTestCases([{ input: '', output: '' }]);
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedQuestion(null);
    setError('');
  };

  const handleOptionChange = (idx, value) => {
    const next = [...formOptions];
    next[idx] = value;
    setFormOptions(next);
  };

  const addOption = () => {
    setFormOptions([...formOptions, '']);
  };

  const removeOption = (idx) => {
    if (formOptions.length <= 2) return;
    const next = formOptions.filter((_, i) => i !== idx);
    setFormOptions(next);
    if (formCorrectMCQ >= next.length) {
      setFormCorrectMCQ(0);
    }
  };

  const handleTestCaseChange = (idx, field, value) => {
    const next = [...formTestCases];
    next[idx][field] = value;
    setFormTestCases(next);
  };

  const addTestCase = () => {
    setFormTestCases([...formTestCases, { input: '', output: '' }]);
  };

  const removeTestCase = (idx) => {
    if (formTestCases.length <= 1) return;
    setFormTestCases(formTestCases.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    let optionsJson = null;
    let correctAnswerJson = '';
    let testCasesJson = null;

    if (formType === 'OBJECTIVE') {
      const filledOpts = formOptions.filter(o => o.trim() !== '');
      if (filledOpts.length < 2) {
        setError('At least 2 options are required for objective questions.');
        setSubmitLoading(false);
        return;
      }
      optionsJson = JSON.stringify(filledOpts);
      correctAnswerJson = String(formCorrectMCQ);
    } else if (formType === 'PROGRAMMING') {
      correctAnswerJson = formCorrectText;
      const filledTc = formTestCases.filter(t => t.input.trim() !== '' || t.output.trim() !== '');
      if (filledTc.length === 0) {
        setError('At least 1 test case input/output is required.');
        setSubmitLoading(false);
        return;
      }
      testCasesJson = JSON.stringify(filledTc);
    } else {
      correctAnswerJson = formCorrectText;
    }

    const payload = {
      questionText: formText,
      questionType: formType,
      difficulty: formDifficulty,
      marks: formMarks,
      optionsJson,
      correctAnswerJson,
      testCasesJson,
      programmingLanguage: formType === 'PROGRAMMING' ? formLang : null
    };

    try {
      if (selectedQuestion) {
        await api.put(`/questions/${selectedQuestion.id}`, payload);
      } else {
        await api.post(`/questions?subjectId=${selectedSubjectId}`, payload);
      }
      fetchBankQuestions();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bank question.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (qid) => {
    if (!window.confirm('Delete this question from the general Question Bank?')) return;
    try {
      await api.delete(`/questions/${qid}`);
      fetchBankQuestions();
    } catch (err) {
      alert('Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { label: 'Overview', to: '/faculty/dashboard', icon: BookOpen },
    { label: 'Assessments', to: '/faculty/assessments', icon: FileText },
    { label: 'Question Bank', to: '/faculty/questions', icon: HelpCircle },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Question Bank</h1>
            <p class="text-sm text-slate-500 font-medium font-sans">Manage reusable question pools categorized by difficulty levels and papers.</p>
          </div>
          <button 
            disabled={!selectedSubjectId}
            onClick={() => handleOpenModal()}
            class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 disabled:opacity-50 transition-all shrink-0"
          >
            <Plus class="w-4.5 h-4.5" />
            <span>Create Question</span>
          </button>
        </div>

        {/* Filter Selection Panel */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={courses.length === 0}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium disabled:opacity-60"
            >
              {courses.map(cr => (
                <option key={cr.id} value={cr.id}>{cr.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={subjects.length === 0}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium disabled:opacity-60"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Bank</label>
            <div class="relative">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search question pool..."
                class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Question Cards Grid */}
        {!selectedSubjectId ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center font-sans">
            <BookOpen class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-sm text-slate-500 font-medium">Please select a subject to inspect the Question Bank.</p>
          </div>
        ) : loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Fetching question bank pools...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center font-sans">
            <HelpCircle class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Bank Items Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto font-medium">Create items in the question pool. Faculty can pull them later when editing exam papers.</p>
          </div>
        ) : (
          <div class="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <div key={q.id} class="bg-white border border-slate-100 rounded-2xl p-6 shadow-card hover:shadow-premium transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <span class="w-7 h-7 bg-slate-100 text-[#0F172A] rounded-lg flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {q.questionType}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                      q.difficulty === 'EASY' ? 'text-emerald-700 bg-emerald-50' :
                      q.difficulty === 'MEDIUM' ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <span class="text-xs font-bold text-slate-500">{q.marks} Mark(s)</span>
                    <button onClick={() => handleOpenModal(q)} class="text-slate-400 hover:text-slate-600 transition-colors p-1">
                      <Edit3 class="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} class="text-slate-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p class="text-sm font-semibold text-slate-800 mb-4 whitespace-pre-wrap">{q.questionText}</p>

                {/* Render Options if MCQ */}
                {q.questionType === 'OBJECTIVE' && q.optionsJson && (
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                    {JSON.parse(q.optionsJson).map((opt, oIdx) => (
                      <div 
                        key={oIdx} 
                        className={`flex items-center space-x-2.5 p-2.5 border rounded-xl text-xs font-medium ${
                          Number(q.correctAnswerJson) === oIdx 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-600'
                        }`}
                      >
                        <span class="font-bold uppercase text-[10px]">{String.fromCharCode(97 + oIdx)}.</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render Solution if Essay */}
                {q.questionType === 'SHORT_ANSWER' && (
                  <div class="bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-xs font-medium pl-10 font-mono">
                    <strong class="text-slate-700 block mb-1">Expected Keywords:</strong>
                    <span class="text-slate-500">{q.correctAnswerJson}</span>
                  </div>
                )}

                {/* Render Languages if Coding */}
                {q.questionType === 'PROGRAMMING' && (
                  <div class="space-y-2 pl-10">
                    <div class="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono max-h-40 overflow-y-auto">
                      <strong class="text-slate-400 block mb-2">// Reference Implementation ({q.programmingLanguage})</strong>
                      <pre class="whitespace-pre">{q.correctAnswerJson}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div class="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedQuestion ? 'Modify Bank Question' : 'Create Bank Question'}
                </h3>
                <button onClick={handleCloseModal} class="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} class="max-h-[75vh] overflow-y-auto">
                <div class="p-6 space-y-4">
                  {error && (
                    <div class="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs">
                      <AlertCircle class="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-1">
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        disabled={!!selectedQuestion}
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                      >
                        <option value="OBJECTIVE">MCQ (Objective)</option>
                        <option value="SHORT_ANSWER">Short Essay</option>
                        <option value="PROGRAMMING">Programming</option>
                      </select>
                    </div>

                    <div class="col-span-1">
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Difficulty</label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value)}
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>

                    <div class="col-span-1">
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Marks Weight</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formMarks}
                        onChange={(e) => setFormMarks(Number(e.target.value))}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Question Description</label>
                    <textarea
                      required
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      placeholder="e.g. What is the average time complexity of quicksort?"
                      rows={3}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Render Options if MCQ */}
                  {formType === 'OBJECTIVE' && (
                    <div class="space-y-3 border-t border-slate-100 pt-4">
                      <div class="flex items-center justify-between">
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Multiple Choice Options</label>
                        <button 
                          type="button" 
                          onClick={addOption}
                          class="text-xs font-semibold text-primary hover:text-primary-hover"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div class="space-y-2">
                        {formOptions.map((opt, oIdx) => (
                          <div key={oIdx} class="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="mcqCorrect"
                              checked={formCorrectMCQ === oIdx}
                              onChange={() => setFormCorrectMCQ(oIdx)}
                              class="w-4.5 h-4.5 accent-primary"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                              class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                            />
                            {formOptions.length > 2 && (
                              <button 
                                type="button" 
                                onClick={() => removeOption(oIdx)}
                                class="p-2 text-slate-400 hover:text-red-600 transition-colors"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Solution Input if Essay */}
                  {formType === 'SHORT_ANSWER' && (
                    <div class="border-t border-slate-100 pt-4">
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Expected Solution Keywords</label>
                      <input
                        type="text"
                        required
                        value={formCorrectText}
                        onChange={(e) => setFormCorrectText(e.target.value)}
                        placeholder="Comma-separated keywords (e.g. pointer, complexity, memory)"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-mono font-medium"
                      />
                    </div>
                  )}

                  {/* Render Programming compiler blocks */}
                  {formType === 'PROGRAMMING' && (
                    <div class="space-y-4 border-t border-slate-100 pt-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Language</label>
                          <select
                            value={formLang}
                            onChange={(e) => setFormLang(e.target.value)}
                            class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                          >
                            <option value="java">Java 21</option>
                            <option value="python">Python 3</option>
                            <option value="javascript">Node.js (JavaScript)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reference Answer Script</label>
                        <textarea
                          required
                          value={formCorrectText}
                          onChange={(e) => setFormCorrectText(e.target.value)}
                          placeholder="Provide sample source code implementation that compiles and runs."
                          rows={4}
                          class="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl text-xs outline-none font-mono resize-none"
                        />
                      </div>

                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Test Cases (Standard Input/Output)</label>
                          <button 
                            type="button" 
                            onClick={addTestCase}
                            class="text-xs font-semibold text-primary hover:text-primary-hover"
                          >
                            + Add Test Case
                          </button>
                        </div>

                        {formTestCases.map((tc, tcIdx) => (
                          <div key={tcIdx} class="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
                            <div class="flex-1 grid grid-cols-2 gap-3 pr-8">
                              <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Input Parameters</label>
                                <input
                                  type="text"
                                  required
                                  value={tc.input}
                                  onChange={(e) => handleTestCaseChange(tcIdx, 'input', e.target.value)}
                                  placeholder="e.g. 5 10"
                                  class="w-full px-2 py-1 border border-slate-200 rounded text-xs outline-none"
                                />
                              </div>
                              <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Expected Output</label>
                                <input
                                  type="text"
                                  required
                                  value={tc.output}
                                  onChange={(e) => handleTestCaseChange(tcIdx, 'output', e.target.value)}
                                  placeholder="e.g. 15"
                                  class="w-full px-2 py-1 border border-slate-200 rounded text-xs outline-none"
                                />
                              </div>
                            </div>
                            {formTestCases.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeTestCase(tcIdx)}
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors text-lg"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3 sticky bottom-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all flex items-center"
                  >
                    {submitLoading ? (
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Save to Pool'
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuestionBank;
