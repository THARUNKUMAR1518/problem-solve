import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Edit3, Trash2, KeyRound, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

const Faculty = () => {
  const { user } = useAuth();
  const collegeId = user?.collegeId;

  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get(`/departments/college/${collegeId}`);
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments.');
    }
  };

  // Load Faculty
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?role=FACULTY&collegeId=${collegeId}`);
      setFaculty(response.data);
    } catch (err) {
      setError('Failed to load faculty list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchFaculty();
  }, []);

  const handleOpenModal = (member = null) => {
    setSelectedMember(member);
    if (member) {
      setFormName(member.fullName);
      setFormEmail(member.email);
      setFormPassword(''); // Don't pre-fill password on edit
      setFormDeptId(member.department?.id || '');
      setFormStatus(member.status);
    } else {
      setFormName('');
      setFormEmail('');
      setFormPassword('');
      setFormDeptId(departments.length > 0 ? departments[0].id : '');
      setFormStatus('ACTIVE');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMember(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      fullName: formName,
      email: formEmail,
      role: 'FACULTY',
      status: formStatus,
      ...(formPassword && { password: formPassword }) // Only include password if set
    };

    if (!selectedMember && !formPassword) {
      setError('Password is required for new faculty members.');
      setSubmitLoading(false);
      return;
    }

    try {
      if (selectedMember) {
        await api.put(`/admin/users/${selectedMember.id}`, payload);
      } else {
        // Set basic details for create
        const newPayload = { ...payload, password: formPassword };
        await api.post(`/admin/users?collegeId=${collegeId}&departmentId=${formDeptId}`, newPayload);
      }
      fetchFaculty();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving faculty profile.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member? This will soft-delete their profile.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchFaculty();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete faculty member.');
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          f.email.toLowerCase().includes(search.toLowerCase());
    
    if (selectedDeptId === 'ALL') return matchesSearch;
    return matchesSearch && f.department?.id === Number(selectedDeptId);
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  const navItems = [
    { label: 'Overview', to: '/college-admin/dashboard', icon: Building2 },
    { label: 'Departments', to: '/college-admin/departments', icon: Building2 },
    { label: 'Courses', to: '/college-admin/courses', icon: GraduationCap },
    { label: 'Subjects', to: '/college-admin/subjects', icon: BookOpen },
    { label: 'Faculty', to: '/college-admin/faculty', icon: Users },
    { label: 'Students', to: '/college-admin/students', icon: GraduationCap },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Manage Faculty</h1>
            <p class="text-sm text-slate-500 font-medium">Add, update, and manage teacher profiles and department assignments.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 transition-all shrink-0"
          >
            <Plus class="w-4.5 h-4.5" />
            <span>Add Faculty</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div class="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div class="w-full md:w-64">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => { setSelectedDeptId(e.target.value); setCurrentPage(1); }}
              class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div class="flex-1 w-full relative">
            <label class="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Instructor</label>
            <div class="relative">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name or email..."
                class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Loading faculty list...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <Users class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Faculty Members Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">Enroll instructors to begin hosting and scheduling assessments.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructor</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {currentItems.map((f) => (
                    <tr key={f.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-semibold text-slate-900">{f.fullName}</td>
                      <td class="px-6 py-4 text-xs text-slate-600 font-medium">{f.email}</td>
                      <td class="px-6 py-4 text-xs text-slate-500 font-medium">{f.department?.name || 'Unassigned'}</td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          f.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {f.status === 'ACTIVE' ? <CheckCircle class="w-3 h-3" /> : <XCircle class="w-3 h-3" />}
                          <span>{f.status}</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(f)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(f.id)}
                          class="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-block"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p class="text-xs text-slate-500 font-medium">
                  Showing <span class="font-bold">{indexOfFirstItem + 1}</span> to{' '}
                  <span class="font-bold">{Math.min(indexOfLastItem, filteredFaculty.length)}</span> of{' '}
                  <span class="font-bold">{filteredFaculty.length}</span> instructors
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

        {/* Form Modal */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedMember ? 'Modify Faculty Profile' : 'Enroll Faculty Member'}
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
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Dr. Robert Johnson"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. johnson@ AEC.edu"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {selectedMember ? 'New Password (Optional)' : 'Password'}
                    </label>
                    <input
                      type="password"
                      required={!selectedMember}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder={selectedMember ? 'Leave blank to retain password' : '••••••••'}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {!selectedMember && (
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                      <select
                        value={formDeptId}
                        onChange={(e) => setFormDeptId(e.target.value)}
                        required
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedMember && (
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING_VERIFICATION">Pending Verification</option>
                      </select>
                    </div>
                  )}
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
                      'Save Profile'
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

export default Faculty;
