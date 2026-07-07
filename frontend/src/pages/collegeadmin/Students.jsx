import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building2, Users, GraduationCap, BookOpen, Plus, Search, Edit3, Trash2, Upload, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

const Students = () => {
  const { user } = useAuth();
  const collegeId = user?.collegeId;

  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Import CSV Modal States
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importDeptId, setImportDeptId] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get(`/departments/college/${collegeId}`);
      setDepartments(response.data);
      if (response.data.length > 0) {
        setImportDeptId(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load departments.');
    }
  };

  // Load Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?role=STUDENT&collegeId=${collegeId}`);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchStudents();
  }, []);

  const handleOpenModal = (stud = null) => {
    setSelectedStudent(stud);
    if (stud) {
      setFormName(stud.fullName);
      setFormEmail(stud.email);
      setFormPassword('');
      setFormDeptId(stud.department?.id || '');
      setFormStatus(stud.status);
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
    setSelectedStudent(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      fullName: formName,
      email: formEmail,
      role: 'STUDENT',
      status: formStatus,
      ...(formPassword && { password: formPassword })
    };

    if (!selectedStudent && !formPassword) {
      setError('Password is required for new students.');
      setSubmitLoading(false);
      return;
    }

    try {
      if (selectedStudent) {
        await api.put(`/admin/users/${selectedStudent.id}`, payload);
      } else {
        const newPayload = { ...payload, password: formPassword };
        await api.post(`/admin/users?collegeId=${collegeId}&departmentId=${formDeptId}`, newPayload);
      }
      fetchStudents();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving student details.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? This will soft-delete their profile.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  // CSV Import Handling
  const handleOpenImport = () => {
    setImportDeptId(departments.length > 0 ? departments[0].id : '');
    setCsvFile(null);
    setImportSuccessMsg('');
    setError('');
    setIsImportOpen(true);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false);
    setCsvFile(null);
    setImportSuccessMsg('');
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Please select a CSV file.');
      return;
    }
    setImportLoading(true);
    setError('');
    setImportSuccessMsg('');

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post(`/admin/students/import?collegeId=${collegeId}&departmentId=${importDeptId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImportSuccessMsg(response.data.message + ` Count: ${response.data.count}`);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import student CSV file.');
    } finally {
      setImportLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          s.email.toLowerCase().includes(search.toLowerCase());
    
    if (selectedDeptId === 'ALL') return matchesSearch;
    return matchesSearch && s.department?.id === Number(selectedDeptId);
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

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
            <h1 class="text-2xl font-bold text-slate-900 font-sans">Manage Students</h1>
            <p class="text-sm text-slate-500 font-medium font-sans">Enroll students, import CSV spreadsheets, and manage verification status.</p>
          </div>
          <div class="flex items-center space-x-3 shrink-0">
            <button 
              onClick={handleOpenImport}
              class="flex items-center space-x-1.5 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all"
            >
              <Upload class="w-4 h-4" />
              <span>Import CSV</span>
            </button>
            <button 
              onClick={() => handleOpenModal()}
              class="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all"
            >
              <Plus class="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
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
            <label class="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Student</label>
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
            <p class="text-sm text-slate-500 font-medium">Fetching students...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <GraduationCap class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Students Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">Create student profiles or upload a CSV file to import them in bulk.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {currentItems.map((s) => (
                    <tr key={s.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-semibold text-slate-900">{s.fullName}</td>
                      <td class="px-6 py-4 text-xs text-slate-600 font-medium">{s.email}</td>
                      <td class="px-6 py-4 text-xs text-slate-500 font-medium">{s.department?.name || 'Unassigned'}</td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {s.status === 'ACTIVE' ? <CheckCircle class="w-3 h-3" /> : <XCircle class="w-3 h-3" />}
                          <span>{s.status}</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(s)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
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
                  <span class="font-bold">{Math.min(indexOfLastItem, filteredStudents.length)}</span> of{' '}
                  <span class="font-bold">{filteredStudents.length}</span> students
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

        {/* Student Profile Modal */}
        {isOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">
                  {selectedStudent ? 'Modify Student Profile' : 'Enroll Student'}
                </h3>
                <button onClick={handleCloseModal} class="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div class="p-6 space-y-4">
                  {error && (
                    <div class="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-sans">
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
                      placeholder="e.g. John Doe"
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
                      placeholder="e.g. john@ AEC.edu"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {selectedStudent ? 'New Password (Optional)' : 'Password'}
                    </label>
                    <input
                      type="password"
                      required={!selectedStudent}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder={selectedStudent ? 'Leave blank to retain password' : '••••••••'}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {!selectedStudent && (
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

                  {selectedStudent && (
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

        {/* CSV Import Modal */}
        {isImportOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">Import Students from CSV</h3>
                <button onClick={handleCloseImport} class="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleImportSubmit}>
                <div class="p-6 space-y-4">
                  {error && (
                    <div class="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs">
                      <AlertCircle class="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {importSuccessMsg && (
                    <div class="flex items-start space-x-2 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs">
                      <CheckCircle class="w-4 h-4 shrink-0" />
                      <span>{importSuccessMsg}</span>
                    </div>
                  )}

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Department</label>
                    <select
                      value={importDeptId}
                      onChange={(e) => setImportDeptId(e.target.value)}
                      required
                      class="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Upload CSV File</label>
                    <input
                      type="file"
                      accept=".csv"
                      required
                      onChange={handleFileChange}
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium"
                    />
                    <p class="text-[10px] text-slate-400 mt-1">
                      Ensure your CSV file contains column headers: <strong>fullName</strong>, <strong>email</strong>, and <strong>password</strong>.
                    </p>
                  </div>
                </div>

                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseImport}
                    class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={importLoading || !csvFile}
                    class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all flex items-center"
                  >
                    {importLoading ? (
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Start Enrollment'
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

export default Students;
