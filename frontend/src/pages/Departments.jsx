import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Edit3, Trash2, AlertCircle
} from 'lucide-react';

const Departments = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(user?.collegeId || '');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal form states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formName, setFormName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch colleges list (Super Admin only)
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

  // Fetch departments when selected college changes
  const fetchDepartments = async () => {
    if (!selectedCollegeId) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/departments/college/${selectedCollegeId}`);
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments.');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [selectedCollegeId]);

  const handleOpenModal = (dept = null) => {
    setSelectedDept(dept);
    if (dept) {
      setFormName(dept.name);
    } else {
      setFormName('');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedDept(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      if (selectedDept) {
        await api.put(`/departments/${selectedDept.id}`, { name: formName });
      } else {
        await api.post(`/departments?collegeId=${selectedCollegeId}`, { name: formName });
      }
      fetchDepartments();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving department details.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This will soft-delete the record.')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department.');
    }
  };

  const filteredDepts = departments.filter(dept => 
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepts.length / itemsPerPage);

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

  return (
    <DashboardLayout navItems={isSuperAdmin ? superAdminNav : collegeAdminNav}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Departments</h1>
            <p class="text-sm text-slate-500 font-medium">Configure academic departments and link them to courses.</p>
          </div>
          <button 
            disabled={!selectedCollegeId}
            onClick={() => handleOpenModal()}
            class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 disabled:opacity-50 transition-all shrink-0"
          >
            <Plus class="w-4.5 h-4.5" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Filter Selection Panel */}
        <div class="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          {isSuperAdmin && (
            <div class="w-full sm:w-64">
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

          <div class="flex-1 w-full relative">
            <label class="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Department</label>
            <div class="relative">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search departments..."
                class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Fetching departments...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <Users class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Departments Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">Create a department to establish your academic structure.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Name</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {currentItems.map((dept) => (
                    <tr key={dept.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(dept)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(dept.id)}
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
                  <span class="font-bold">{Math.min(indexOfLastItem, filteredDepts.length)}</span> of{' '}
                  <span class="font-bold">{filteredDepts.length}</span> departments
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
                  {selectedDept ? 'Modify Department' : 'Create Department'}
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
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
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

export default Departments;
