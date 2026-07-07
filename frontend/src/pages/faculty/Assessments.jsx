import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FileText, Plus, Search, Calendar, Clock, Edit3, Trash2, HelpCircle, Check, AlertCircle, Play, Eye
} from 'lucide-react';

const Assessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const creatorId = user?.userId;
  const collegeId = user?.collegeId;

  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [assessments, setAssessments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal form states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDuration, setFormDuration] = useState(60);
  const [formTotalMarks, setFormTotalMarks] = useState(100);
  const [formPassMarks, setFormPassMarks] = useState(40);
  const [formRandomCount, setFormRandomCount] = useState(0);
  const [formNegMarking, setFormNegMarking] = useState(false);
  const [formNegMarks, setFormNegMarks] = useState(0.25);
  const [formShuffleQuest, setFormShuffleQuest] = useState(false);
  const [formShuffleOpt, setFormShuffleOpt] = useState(false);
  const [formStartTime, setFormStartTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load cascading options
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

  // Load assessments
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/assessments/creator/${creatorId}`);
      setAssessments(response.data);
    } catch (err) {
      setError('Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [creatorId]);

  const handleOpenModal = (exam = null) => {
    setSelectedExam(exam);
    if (exam) {
      setFormTitle(exam.title);
      setFormDesc(exam.description || '');
      setFormDuration(exam.durationMinutes);
      setFormTotalMarks(exam.totalMarks);
      setFormPassMarks(exam.passingMarks);
      setFormRandomCount(exam.randomQuestionsCount);
      setFormNegMarking(exam.negativeMarking);
      setFormNegMarks(exam.negativeMarksPerQuestion);
      setFormShuffleQuest(exam.shuffleQuestions);
      setFormShuffleOpt(exam.shuffleOptions);
      setFormStartTime(exam.startTime ? exam.startTime.substring(0, 16) : '');
      setFormEndTime(exam.endTime ? exam.endTime.substring(0, 16) : '');
      setSelectedSubjectId(exam.subject?.id || '');
    } else {
      setFormTitle('');
      setFormDesc('');
      setFormDuration(60);
      setFormTotalMarks(100);
      setFormPassMarks(40);
      setFormRandomCount(0);
      setFormNegMarking(false);
      setFormNegMarks(0.25);
      setFormShuffleQuest(false);
      setFormShuffleOpt(false);
      setFormStartTime('');
      setFormEndTime('');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedExam(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      title: formTitle,
      description: formDesc,
      durationMinutes: formDuration,
      totalMarks: formTotalMarks,
      passingMarks: formPassMarks,
      randomQuestionsCount: formRandomCount,
      negativeMarking: formNegMarking,
      negativeMarksPerQuestion: formNegMarks,
      shuffleQuestions: formShuffleQuest,
      shuffleOptions: formShuffleOpt,
      startTime: formStartTime ? formStartTime + ':00' : null,
      endTime: formEndTime ? formEndTime + ':00' : null
    };

    try {
      if (selectedExam) {
        await api.put(`/assessments/${selectedExam.id}`, payload);
        fetchAssessments();
        handleCloseModal();
      } else {
        const response = await api.post(`/assessments?subjectId=${selectedSubjectId}&creatorId=${creatorId}`, payload);
        handleCloseModal();
        navigate(`/faculty/assessments/${response.data.id}/questions`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assessment parameters.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment? All configurations will be soft-deleted.')) return;
    try {
      await api.delete(`/assessments/${id}`);
      fetchAssessments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete assessment.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/assessments/${id}/status?status=${status}`);
      fetchAssessments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assessment status.');
    }
  };

  const filteredExams = assessments.filter(exam =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { label: 'Overview', to: '/faculty/dashboard', icon: Calendar },
    { label: 'Assessments', to: '/faculty/assessments', icon: FileText },
    { label: 'Question Bank', to: '/faculty/questions', icon: HelpCircle },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Assessments</h1>
            <p class="text-sm text-slate-500 font-medium">Create assessments, configure rules, and configure anti-cheating proctor settings.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 transition-all shrink-0"
          >
            <Plus class="w-4.5 h-4.5" />
            <span>Create Exam</span>
          </button>
        </div>

        {/* Search Panel */}
        <div class="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div class="flex-1 w-full relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessments by name..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Fetching scheduled exams...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <FileText class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Assessments Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">Get started by creating your first online proctored exam sheet.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                class="bg-white border border-slate-100 rounded-2xl p-6 shadow-card hover:shadow-premium transition-all flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <span class="px-2 py-0.5 bg-slate-100 text-[#0F172A] text-[10px] font-bold rounded uppercase tracking-wider">
                        {exam.subject?.name}
                      </span>
                      <h3 class="font-bold text-slate-900 text-lg mt-2">{exam.title}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${exam.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50' :
                        exam.status === 'SCHEDULED' ? 'text-blue-700 bg-blue-50' :
                          exam.status === 'COMPLETED' ? 'text-slate-500 bg-slate-100' : 'text-slate-600 bg-slate-100'
                      }`}>
                      {exam.status}
                    </span>
                  </div>

                  <p class="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{exam.description || 'No description provided.'}</p>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4 mb-6">
                    <div class="flex items-center space-x-1.5">
                      <Clock class="w-4 h-4 text-slate-400" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                      <FileText class="w-4 h-4 text-slate-400" />
                      <span>{exam.totalMarks} Marks</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                      <HelpCircle class="w-4 h-4 text-slate-400" />
                      <span>Pass: {exam.passingMarks}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div class="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/faculty/assessments/${exam.id}/questions`)}
                      class="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-semibold transition-all"
                    >
                      <Plus class="w-3.5 h-3.5" />
                      <span>Questions</span>
                    </button>
                    <button
                      onClick={() => handleOpenModal(exam)}
                      class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                      title="Edit Configuration"
                    >
                      <Edit3 class="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      class="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-block"
                      title="Delete"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>

                  <div class="flex items-center space-x-2">
                    {exam.status === 'DRAFT' && (
                      <button
                        onClick={() => handleStatusChange(exam.id, 'SCHEDULED')}
                        class="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-lg shadow-primary/10 transition-all"
                      >
                        Schedule
                      </button>
                    )}
                    {exam.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleStatusChange(exam.id, 'ACTIVE')}
                        class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/10 transition-all flex items-center space-x-1"
                      >
                        <Play class="w-3 h-3 fill-current" />
                        <span>Go Live</span>
                      </button>
                    )}
                    {exam.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(exam.id, 'COMPLETED')}
                        class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-all"
                      >
                        Stop Exam
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Assessment Form Modal */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div class="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden my-8 animate-in fade-in zoom-in duration-200">

              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedExam ? 'Configure Proctored Exam' : 'Setup Proctored Exam'}
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

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                      <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                        <select
                          value={selectedDeptId}
                          onChange={(e) => setSelectedDeptId(e.target.value)}
                          required
                          disabled={!!selectedExam}
                          class="w-full bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs outline-none focus:border-primary font-medium disabled:opacity-60"
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course</label>
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          required
                          disabled={!!selectedExam || courses.length === 0}
                          class="w-full bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs outline-none focus:border-primary font-medium disabled:opacity-60"
                        >
                          {courses.map(cr => (
                            <option key={cr.id} value={cr.id}>{cr.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                        <select
                          value={selectedSubjectId}
                          onChange={(e) => setSelectedSubjectId(e.target.value)}
                          required
                          disabled={!!selectedExam || subjects.length === 0}
                          class="w-full bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs outline-none focus:border-primary font-medium disabled:opacity-60"
                        >
                          {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assessment Title</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Data Structures Midterm"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Instructions / Description</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Write instructions regarding anti-cheating violations, webcam sharing, browser lockdowns..."
                      rows={3}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium resize-none"
                    />
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formDuration}
                        onChange={(e) => setFormDuration(Number(e.target.value))}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Total Marks</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formTotalMarks}
                        onChange={(e) => setFormTotalMarks(Number(e.target.value))}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Passing Marks</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formPassMarks}
                        onChange={(e) => setFormPassMarks(Number(e.target.value))}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Start Time Window</label>
                      <input
                        type="datetime-local"
                        required
                        value={formStartTime}
                        onChange={(e) => setFormStartTime(e.target.value)}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">End Time Window</label>
                      <input
                        type="datetime-local"
                        required
                        value={formEndTime}
                        onChange={(e) => setFormEndTime(e.target.value)}
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 pt-2">
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shuffleQ"
                        checked={formShuffleQuest}
                        onChange={(e) => setFormShuffleQuest(e.target.checked)}
                        class="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="shuffleQ" class="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Shuffle Questions</label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shuffleO"
                        checked={formShuffleOpt}
                        onChange={(e) => setFormShuffleOpt(e.target.checked)}
                        class="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="shuffleO" class="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Shuffle Options</label>
                    </div>
                  </div>

                  <div class="border-t border-slate-100 pt-4 space-y-4">
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="negMark"
                        checked={formNegMarking}
                        onChange={(e) => setFormNegMarking(e.target.checked)}
                        class="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="negMark" class="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Enable Negative Marks</label>
                    </div>

                    {formNegMarking && (
                      <div class="w-full max-w-xs animate-in slide-in-from-top-2 duration-200">
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Negative Marks Value</label>
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          required
                          value={formNegMarks}
                          onChange={(e) => setFormNegMarks(Number(e.target.value))}
                          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        />
                      </div>
                    )}

                    <div class="flex flex-col">
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Random Questions Draw Count</label>
                      <input
                        type="number"
                        min="0"
                        value={formRandomCount}
                        onChange={(e) => setFormRandomCount(Number(e.target.value))}
                        class="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      />
                      <span class="text-[10px] text-slate-400 mt-1">
                        If 0, uses manually assigned questions. If greater than 0, draws a random set from the subject's Question Bank.
                      </span>
                    </div>
                  </div>

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
                      'Save Exam Details'
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

export default Assessments;
