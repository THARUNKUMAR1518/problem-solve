import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Filter, Edit3, Trash2, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('ALL');

  // Form Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await api.get('/colleges');
      setColleges(response.data);
    } catch (err) {
      setError('Failed to fetch college list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleOpenModal = (college = null) => {
    setSelectedCollege(college);
    if (college) {
      setFormName(college.name);
      setFormCode(college.code);
      setFormAddress(college.address || '');
      setFormActive(college.active);
    } else {
      setFormName('');
      setFormCode('');
      setFormAddress('');
      setFormActive(true);
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedCollege(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      name: formName,
      code: formCode.toUpperCase(),
      address: formAddress,
      active: formActive
    };

    try {
      if (selectedCollege) {
        await api.put(`/colleges/${selectedCollege.id}`, payload);
      } else {
        await api.post('/colleges', payload);
      }
      fetchColleges();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving college details.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this college? This will soft-delete the record.')) return;
    try {
      await api.delete(`/colleges/${id}`);
      fetchColleges();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete college.');
    }
  };

  // Filter & Search Logic
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(search.toLowerCase()) || 
                          college.code.toLowerCase().includes(search.toLowerCase());
    
    if (filterActive === 'ALL') return matchesSearch;
    if (filterActive === 'ACTIVE') return matchesSearch && college.active;
    if (filterActive === 'INACTIVE') return matchesSearch && !college.active;
    return matchesSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredColleges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);

  const navItems = [
    { label: 'Overview', to: '/super-admin/dashboard', icon: Building2 },
    { label: 'Colleges', to: '/super-admin/colleges', icon: Building2 },
    { label: 'Departments', to: '/super-admin/departments', icon: Users },
    { label: 'Courses', to: '/super-admin/courses', icon: GraduationCap },
    { label: 'Subjects', to: '/super-admin/subjects', icon: BookOpen },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Manage Colleges</h1>
            <p class="text-sm text-slate-500 font-medium">Register universities, edit location profiles, and adjust license/active flags.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            class="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 transition-all shrink-0"
          >
            <Plus class="w-4.5 h-4.5" />
            <span>Add College</span>
          </button>
        </div>

        {/* Filters & Actions Panel */}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div class="relative flex-1 max-w-md">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or code..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div class="flex items-center space-x-3">
            <Filter class="w-4 h-4 text-slate-400" />
            <select
              value={filterActive}
              onChange={(e) => { setFilterActive(e.target.value); setCurrentPage(1); }}
              class="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Colleges Grid/Table */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Fetching registered institutions...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <Building2 class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Colleges Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">We couldn't find any registered institutions matching your query. Add a new college to get started.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location / Address</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {currentItems.map((college) => (
                    <tr key={college.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-semibold text-slate-900">{college.name}</td>
                      <td class="px-6 py-4">
                        <span class="px-2 py-0.5 bg-slate-100 text-[#0F172A] font-mono text-xs font-semibold rounded">
                          {college.code}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-600 truncate max-w-xs">{college.address || 'N/A'}</td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          college.active ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                        }`}>
                          {college.active ? <CheckCircle class="w-3.5 h-3.5" /> : <XCircle class="w-3.5 h-3.5" />}
                          <span>{college.active ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2 shrink-0">
                        <button 
                          onClick={() => handleOpenModal(college)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(college.id)}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p class="text-xs text-slate-500 font-medium">
                  Showing <span class="font-bold">{indexOfFirstItem + 1}</span> to{' '}
                  <span class="font-bold">{Math.min(indexOfLastItem, filteredColleges.length)}</span> of{' '}
                  <span class="font-bold">{filteredColleges.length}</span> institutions
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

        {/* Add/Edit Modal (Zoho-like Dialog Overlay) */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedCollege ? 'Modify College Registry' : 'Register New College'}
                </h3>
                <button 
                  onClick={handleCloseModal}
                  class="text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold"
                >
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
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">College Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Apex Engineering College"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Code</label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="e.g. AEC"
                      disabled={!!selectedCollege}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-mono font-medium disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location Address</label>
                    <textarea
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="e.g. 123 University Drive, Cityville"
                      rows={2}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium resize-none"
                    />
                  </div>

                  <div class="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      class="w-4.5 h-4.5 accent-primary"
                    />
                    <label htmlFor="active" class="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">
                      Mark as Active
                    </label>
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

export default Colleges;
