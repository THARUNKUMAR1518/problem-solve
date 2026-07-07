import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { 
  Building2, Users, BookOpen, GraduationCap, Plus, Trash2, Edit3, CheckCircle, AlertTriangle
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [stats, setStats] = useState({
    collegesCount: 1,
    adminsCount: 1,
    subjectsCount: 1,
    activeExams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial colleges list
    const fetchColleges = async () => {
      try {
        const response = await api.get('/colleges'); // Placeholder backend endpoint to be fully expanded in Phase 2
        setColleges(response.data);
      } catch (err) {
        // Fallback for initial demo seed verification
        setColleges([
          { id: 1, name: 'Apex Engineering College', code: 'AEC', address: '123 University Drive, Cityville', active: true }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const navItems = [
    { label: 'Overview', to: '/super-admin/dashboard', icon: Building2 },
    { label: 'Colleges', to: '/super-admin/colleges', icon: Building2 },
    { label: 'Departments', to: '/super-admin/departments', icon: Users },
    { label: 'Courses', to: '/super-admin/courses', icon: GraduationCap },
    { label: 'Subjects', to: '/super-admin/subjects', icon: BookOpen },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">System Overview</h1>
          <p class="text-sm text-slate-500">Monitor and manage multi-tenant college infrastructures and system configurations.</p>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Colleges</p>
              <h3 class="text-3xl font-bold text-slate-900">{stats.collegesCount}</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl text-primary">
              <Building2 class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">College Admins</p>
              <h3 class="text-3xl font-bold text-slate-900">{stats.adminsCount}</h3>
            </div>
            <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Users class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Global Subjects</p>
              <h3 class="text-3xl font-bold text-slate-900">{stats.subjectsCount}</h3>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <BookOpen class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Exams</p>
              <h3 class="text-3xl font-bold text-slate-900">{stats.activeExams}</h3>
            </div>
            <div class="p-3 bg-rose-50 rounded-xl text-rose-600">
              <AlertTriangle class="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Colleges Management Table */}
        <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Registered Colleges</h3>
              <p class="text-xs text-slate-500">Configure institutions and assign domain limits.</p>
            </div>
            <button class="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all">
              <Plus class="w-4 h-4" />
              <span>Register College</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">College Name</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Institution Code</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address / Location</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {colleges.map((college) => (
                  <tr key={college.id} class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-semibold text-slate-900">{college.name}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-0.5 bg-slate-100 text-[#0F172A] rounded-md font-mono text-xs font-semibold">
                        {college.code}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">
                      {college.address}
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle class="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                      <button class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block">
                        <Edit3 class="w-4 h-4" />
                      </button>
                      <button class="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-block">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
