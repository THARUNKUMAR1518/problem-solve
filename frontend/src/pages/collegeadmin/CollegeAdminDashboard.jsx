import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Building2, Users, GraduationCap, BookOpen, UserPlus, Upload, Trash2, Edit3, KeyRound
} from 'lucide-react';

const CollegeAdminDashboard = () => {
  const [faculty, setFaculty] = useState([
    { id: 1, name: 'Dr. Robert Johnson', email: 'faculty@secureassess.com', department: 'Computer Science & Engineering', status: 'ACTIVE' }
  ]);

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
      <div class="space-y-8">
        {/* Welcome Banner */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">College Administration</h1>
          <p class="text-sm text-slate-500">Configure academic structures, enroll students, and manage faculty credentials.</p>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Departments</p>
              <h3 class="text-3xl font-bold text-slate-900">1</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl text-primary">
              <Building2 class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Courses</p>
              <h3 class="text-3xl font-bold text-slate-900">1</h3>
            </div>
            <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
              <GraduationCap class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Registered Faculty</p>
              <h3 class="text-3xl font-bold text-slate-900">1</h3>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Users class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Registered Students</p>
              <h3 class="text-3xl font-bold text-slate-900">1</h3>
            </div>
            <div class="p-3 bg-rose-50 rounded-xl text-rose-600">
              <GraduationCap class="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Faculty List */}
        <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-100 gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Faculty Members</h3>
              <p class="text-xs text-slate-500">Manage instructors authorized to schedule exams.</p>
            </div>
            <div class="flex items-center space-x-3 shrink-0">
              <button class="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all">
                <Upload class="w-4 h-4" />
                <span>Import CSV</span>
              </button>
              <button class="flex items-center space-x-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all">
                <UserPlus class="w-4 h-4" />
                <span>Add Faculty</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Name</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {faculty.map((member) => (
                  <tr key={member.id} class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-semibold text-slate-900">{member.name}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">
                      {member.email}
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">
                      {member.department}
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {member.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                      <button class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block" title="Edit Profile">
                        <Edit3 class="w-4 h-4" />
                      </button>
                      <button class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-block" title="Reset Credentials">
                        <KeyRound class="w-4 h-4" />
                      </button>
                      <button class="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-block" title="Delete">
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

export default CollegeAdminDashboard;
