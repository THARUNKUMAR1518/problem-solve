import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Edit3, Trash2, AlertCircle
} from 'lucide-react';

const Subjects = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isFaculty = user?.role === 'FACULTY';

  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(user?.collegeId || '');
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Colleges (Super Admin)
  useEffect(() => {
    if (isSuperAdmin) {
      const fetchColleges = async () => {
        try {
          const response = await api.get('/colleges');
          setColleges(response.data);
          if (response.data.length > 0) {
            setSelectedCollegeId(response.data[0].id);
          }
        } catch (err) {
          setError('Failed to fetch colleges.');
        }
      };
      fetchColleges();
    }
  }, [isSuperAdmin]);

  // Load Departments when College changes
  useEffect(() => {
    const fetchDepts = async () => {
      if (!selectedCollegeId) return;
      try {
        const response = await api.get(`/departments/college/${selectedCollegeId}`);
        setDepartments(response.data);
        if (response.data.length > 0) {
          setSelectedDeptId(response.data[0].id);
        } else {
          setSelectedDeptId('');
          setCourses([]);
          setSelectedCourseId('');
          setSubjects([]);
        }
      } catch (err) {
        setDepartments([]);
        setSelectedDeptId('');
        setCourses([]);
        setSelectedCourseId('');
        setSubjects([]);
      }
    };
    fetchDepts();
  }, [selectedCollegeId]);

  // Load Courses when Department changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedDeptId) return;
      try {
        const response = await api.get(`/courses/department/${selectedDeptId}`);
        setCourses(response.data);
        if (response.data.length > 0) {
          setSelectedCourseId(response.data[0].id);
        } else {
          setSelectedCourseId('');
          setSubjects([]);
        }
      } catch (err) {
        setCourses([]);
        setSelectedCourseId('');
        setSubjects([]);
      }
    };
    fetchCourses();
  }, [selectedDeptId]);

  // Load Subjects when Course changes
  const fetchSubjects = async () => {
    if (!selectedCourseId) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/subjects/course/${selectedCourseId}`);
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to fetch subjects.');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [selectedCourseId]);

  const handleOpenModal = (subj = null) => {
    setSelectedSubject(subj);
    if (subj) {
      setFormName(subj.name);
      setFormCode(subj.code);
    } else {
      setFormName('');
      setFormCode('');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedSubject(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      name: formName,
      code: formCode.toUpperCase()
    };

    try {
      if (selectedSubject) {
        await api.put(`/subjects/${selectedSubject.id}`, payload);
      } else {
        await api.post(`/subjects?courseId=${selectedCourseId}`, payload);
      }
      fetchSubjects();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving subject details.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will soft-delete the record.')) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subject.');
    }
  };

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(search.toLowerCase()) || 
    sub.code.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const superAdminNav = [
    { label: 'Overview', to: '/super-admin/dashboard', icon: Building2 },
    { label: 'Colleges', to: '/super-admin/colleges', icon: Building2 },
    { label: 'Departments', to: '/super-admin/departments', icon: Users },
    { label: 'Courses', to: '/super-admin/courses', icon: GraduationCap },
    { label: 'Subjects', to: '/super-admin/subjects', icon: BookOpen },
  ];

  const collegeAdminNav = [
    { label: 'Overview', to: '/college-admin/dashboard', icon: Building2 },
    { label: 'Departments', to: '/college-admin/departments', icon: Building2 },
    { label: 'Courses', to: '/college-admin/courses', icon: GraduationCap },
    { label: 'Subjects', to: '/college-admin/subjects', icon: BookOpen },
    { label: 'Faculty', to: '/college-admin/faculty', icon: Users },
    { label: 'Students', to: '/college-admin/students', icon: GraduationCap },
  ];

  const facultyNav = [
    { label: 'Overview', to: '/faculty/dashboard', icon: BookOpen },
    { label: 'Assessments', to: '/faculty/assessments', icon: FileText },
    { label: 'Question Bank', to: '/faculty/questions', icon: BookOpen },
    { label: 'Evaluation', to: '/faculty/evaluation', icon: ClipboardCheck },
    { label: 'Analytics', to: '/faculty/analytics', icon: TrendingUp },
  ];

  const getNavItems = () => {
    if (isSuperAdmin) return superAdminNav;
    if (isFaculty) return facultyNav;
    return collegeAdminNav;
  };

  return (
    <DashboardLayout navItems={getNavItems()}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Subjects / Syllabus</h1>
            <p class="text-sm text-slate-500 font-medium">Manage subject papers mapped directly to classes and assessment banks.</p>
          </div>
          {!isFaculty && (
            <button 
              disabled={!selectedCourseId}
              onClick={() => handleOpenModal()}
              class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 disabled:opacity-50 transition-all shrink-0"
            >
              <Plus class="w-4.5 h-4.5" />
              <span>Add Subject</span>
            </button>
          )}
        </div>

        {/* Cascade Filters */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          {isSuperAdmin && (
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select College</label>
              <select
                value={selectedCollegeId}
                onChange={(e) => { setSelectedCollegeId(e.target.value); setCurrentPage(1); }}
                class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
              >
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div class={isSuperAdmin ? '' : 'sm:col-span-1'}>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => { setSelectedDeptId(e.target.value); setCurrentPage(1); }}
              disabled={departments.length === 0}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium disabled:opacity-60"
            >
              {departments.length === 0 ? (
                <option value="">No Departments Available</option>
              ) : (
                departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => { setSelectedCourseId(e.target.value); setCurrentPage(1); }}
              disabled={courses.length === 0}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium disabled:opacity-60"
            >
              {courses.length === 0 ? (
                <option value="">No Courses Available</option>
              ) : (
                courses.map(cr => (
                  <option key={cr.id} value={cr.id}>{cr.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Subject</label>
            <div class="relative">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name or code..."
                class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        {!selectedCourseId ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <BookOpen class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-sm text-slate-500 font-medium font-sans">Please select a program course to inspect subject papers.</p>
          </div>
        ) : loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Fetching syllabus contents...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <BookOpen class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Subjects Registered</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">Create a subject to begin mapping exam question modules.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Name</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Code</th>
                    {!isFaculty && (
                      <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {currentItems.map((subj) => (
                    <tr key={subj.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-semibold text-slate-900">{subj.name}</td>
                      <td class="px-6 py-4">
                        <span class="px-2.5 py-0.5 bg-slate-100 text-[#0F172A] font-mono text-xs font-semibold rounded">
                          {subj.code}
                        </span>
                      </td>
                      {!isFaculty && (
                        <td class="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenModal(subj)}
                            class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                          >
                            <Edit3 class="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(subj.id)}
                            class="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-block"
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p class="text-xs text-slate-500 font-medium">
                  Showing <span class="font-bold">{indexOfFirstItem + 1}</span> to{' '}
                  <span class="font-bold">{Math.min(indexOfLastItem, filteredSubjects.length)}</span> of{' '}
                  <span class="font-bold">{filteredSubjects.length}</span> papers
                </p>
                <div class="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    class="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    class="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subject Form Modal */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedSubject ? 'Modify Subject' : 'Create Subject'}
                </h3>
                <button onClick={handleCloseModal} class="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div class="p-6 space-y-4">
                  {error && (
                    <div class="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs">
                      <AlertCircle class="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Data Structures and Algorithms"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject Code</label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="e.g. CS201"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
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
                      'Save Changes'
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

export default Subjects;
