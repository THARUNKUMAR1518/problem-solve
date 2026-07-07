import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  BookOpen, FileText, ClipboardCheck, TrendingUp, Search, Eye, Award, CheckCircle, XCircle, AlertTriangle, KeyRound
} from 'lucide-react';

const Evaluation = () => {
  const { user } = useAuth();
  const creatorId = user?.userId;

  const [assessments, setAssessments] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Grading Drawer/Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);
  
  // Local grading input buffers
  const [gradesBuffer, setGradesBuffer] = useState({}); // Mapped by Answer ID -> { score, isCorrect, feedback }
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch assessments scheduled by this faculty
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get(`/assessments/creator/${creatorId}`);
        setAssessments(response.data);
        if (response.data.length > 0) {
          setSelectedExamId(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch assessments.');
      }
    };
    fetchAssessments();
  }, [creatorId]);

  // Fetch student sessions when selected assessment changes
  const fetchSessions = async () => {
    if (!selectedExamId) return;
    setLoading(true);
    try {
      const response = await api.get(`/exams/sessions/assessment/${selectedExamId}`);
      setSessions(response.data);
    } catch (err) {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedExamId]);

  const handleOpenGrading = async (sess) => {
    setSelectedSession(sess);
    setIsOpen(true);
    setGradesBuffer({});
    
    try {
      // Load student answers
      const answersRes = await api.get(`/exams/sessions/${sess.id}/answers`);
      setAnswers(answersRes.data);

      // Load proctor logs
      // In a real application, we would load proctor logs. Let's make a mock check or API endpoint.
      // In ViolationLogRepository, we have `findByExamSessionId`. Let's expose it or mock it.
      // We will define it as: GET /api/exams/sessions/{id}/violations or mock it.
      // Let's mock a simple log list or call `/exams/sessions/${sess.id}/violations`.
      setSessionLogs([]);

      // Initialize buffer with existing values
      const initialBuffer = {};
      answersRes.data.forEach(ans => {
        initialBuffer[ans.id] = {
          score: ans.marksObtained,
          isCorrect: ans.isCorrect || false,
          feedback: ans.feedback || ''
        };
      });
      setGradesBuffer(initialBuffer);

    } catch (err) {
      alert('Failed to load student exam responses.');
    }
  };

  const handleCloseGrading = () => {
    setIsOpen(false);
    setSelectedSession(null);
    setAnswers([]);
  };

  const handleGradeChange = (ansId, field, value) => {
    setGradesBuffer(prev => ({
      ...prev,
      [ansId]: {
        ...prev[ansId],
        [field]: value
      }
    }));
  };

  const handlePublishGrade = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // 1. Submit manual grades for each answer one by one
      for (const ansId of Object.keys(gradesBuffer)) {
        const item = gradesBuffer[ansId];
        const answerObj = answers.find(a => a.id === Number(ansId));
        if (answerObj && answerObj.question.questionType !== 'OBJECTIVE') {
          // POST /api/exams/sessions/{id}/answer-grade or similar, or update answer fields
          // Since we want to support updating the score in backend, we can write an endpoint or let result generator compute it.
          // Wait! To keep it simple and robust, let's create a quick PUT endpoint in ExamSessionController or write it in Service.
          // Or we can post the graded answer to `/api/exams/sessions/${selectedSession.id}/answer` with a query parameter!
          // Yes! In `ExamSessionController.saveAnswer`, we saved the student answer. We can add an endpoint to save evaluations:
          // We can put `/api/exams/sessions/answers/${ansId}/grade?score=...&isCorrect=...&feedback=...` which updates the ExamAnswer object.
          // Let's make this call.
          await api.put(`/exams/sessions/answers/${ansId}/grade?score=${item.score}&isCorrect=${item.isCorrect}&feedback=${encodeURIComponent(item.feedback)}`);
        }
      }

      // 2. Generate and publish final Result score card
      await api.post(`/results/session/${selectedSession.id}`);
      
      fetchSessions();
      handleCloseGrading();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish grades.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const navItems = [
    { label: 'Overview', to: '/faculty/dashboard', icon: BookOpen },
    { label: 'Assessments', to: '/faculty/assessments', icon: FileText },
    { label: 'Question Bank', to: '/faculty/questions', icon: BookOpen },
    { label: 'Evaluation', to: '/faculty/evaluation', icon: ClipboardCheck },
    { label: 'Analytics', to: '/faculty/analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        {/* Header */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900 font-sans">Submissions Evaluation</h1>
          <p class="text-sm text-slate-500 font-medium font-sans">Review student examination sheets, audit proctor logs, and publish scores.</p>
        </div>

        {/* Selection bar */}
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Active Assessment</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            class="w-full max-w-md bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-semibold"
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id}>{a.title} ({a.subject?.name})</option>
            ))}
          </select>
        </div>

        {/* Sessions List */}
        {!selectedExamId ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <ClipboardCheck class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-sm text-slate-500 font-medium font-sans">Please select an assessment to view submissions.</p>
          </div>
        ) : loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center font-sans">
            <ClipboardCheck class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Submissions Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto font-medium">Students enrolled in this course have not completed this assessment yet.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Profile</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Warnings logged</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {sessions.map((sess) => (
                    <tr key={sess.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-slate-900">{sess.student?.fullName}</div>
                        <div class="text-[10px] text-slate-400 font-medium mt-0.5">{sess.student?.email}</div>
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-600 font-medium">
                        {sess.startedAt?.replace('T', ' ')}
                      </td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          sess.currentWarningCount === 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          <AlertTriangle class="w-3 h-3" />
                          <span>{sess.currentWarningCount} Alert(s)</span>
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          sess.status === 'SUBMITTED' ? 'text-emerald-700 bg-emerald-50' : 
                          sess.status === 'FORCE_SUBMITTED' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {sess.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenGrading(sess)}
                          class="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all flex items-center inline-flex space-x-1.5"
                        >
                          <Eye class="w-3.5 h-3.5" />
                          <span>Evaluate</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grading Drawer Modal */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div class="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">Grading student response sheet</h3>
                <button onClick={handleCloseGrading} class="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handlePublishGrade} class="max-h-[70vh] overflow-y-auto">
                <div class="p-6 space-y-6">
                  {/* Student Summary */}
                  <div class="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 class="font-bold text-slate-800 text-sm">{selectedSession?.student?.fullName}</h4>
                      <p class="text-xs text-slate-500 font-medium">{selectedSession?.student?.email}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Session warnings</span>
                      <span class="text-xs font-bold text-red-600">{selectedSession?.currentWarningCount} Alerts</span>
                    </div>
                  </div>

                  {/* Answers Evaluator */}
                  <div class="space-y-6">
                    <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Questions Grader</h3>

                    {answers.map((ans, aIdx) => {
                      const q = ans.question;
                      const isObj = q.questionType === 'OBJECTIVE';

                      return (
                        <div key={ans.id} class="border border-slate-100 p-5 rounded-2xl bg-slate-50/20 space-y-4">
                          <div class="flex items-start justify-between">
                            <span class="font-bold text-xs text-slate-800">Q{aIdx + 1}. {q.questionText}</span>
                            <span class="text-xs font-bold text-slate-500 shrink-0">{q.marks} Mark(s) max</span>
                          </div>

                          {/* Student Answer */}
                          <div class="bg-white p-3 border border-slate-100 rounded-xl pl-4">
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student response</span>
                            {isObj ? (
                              <p class="text-xs text-slate-700 font-medium">
                                Selected Option: <strong>{q.optionsJson ? JSON.parse(q.optionsJson)[Number(ans.studentAnswerJson)] || 'N/A' : 'N/A'}</strong>
                              </p>
                            ) : q.questionType === 'PROGRAMMING' ? (
                              <pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto whitespace-pre">{ans.studentAnswerJson || '// No Answer Response Submitted'}</pre>
                            ) : (
                              <p class="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">{ans.studentAnswerJson || 'No Answer Response Submitted'}</p>
                            )}
                          </div>

                          {/* Evaluation box */}
                          {isObj ? (
                            <div class="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                              <span>Auto-evaluated by scoring engine</span>
                              <span>Score Obtained: {ans.marksObtained} Marks</span>
                            </div>
                          ) : (
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                              <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score Obtained</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max={q.marks}
                                  value={gradesBuffer[ans.id]?.score || 0}
                                  onChange={(e) => handleGradeChange(ans.id, 'score', Number(e.target.value))}
                                  class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary font-medium"
                                />
                              </div>

                              <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grading Flag</label>
                                <select
                                  value={gradesBuffer[ans.id]?.isCorrect || false}
                                  onChange={(e) => handleGradeChange(ans.id, 'isCorrect', e.target.value === 'true')}
                                  class="w-full bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary font-semibold"
                                >
                                  <option value="true">Correct (Pass)</option>
                                  <option value="false">Incorrect (Fail)</option>
                                </select>
                              </div>

                              <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Feedback</label>
                                <input
                                  type="text"
                                  value={gradesBuffer[ans.id]?.feedback || ''}
                                  onChange={(e) => handleGradeChange(ans.id, 'feedback', e.target.value)}
                                  placeholder="e.g. Good code syntax..."
                                  class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary font-medium"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3 sticky bottom-0 z-10">
                  <button
                    type="button"
                    onClick={handleCloseGrading}
                    class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
                  >
                    Close Sheet
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all flex items-center"
                  >
                    {submitLoading ? (
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Publish Score Card'
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

export default Evaluation;
