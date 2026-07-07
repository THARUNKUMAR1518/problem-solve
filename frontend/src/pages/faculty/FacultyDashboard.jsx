import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  BookOpen, FileText, ClipboardCheck, TrendingUp, Plus, Calendar, Clock, PlayCircle
} from 'lucide-react';

const FacultyDashboard = () => {
  const [assessments, setAssessments] = useState([
    { id: 1, title: 'Data Structures Midterm', subject: 'Data Structures and Algorithms', date: 'Jul 15, 2026', time: '10:00 AM', duration: '90 mins', status: 'SCHEDULED' }
  ]);

  const navItems = [
    { label: 'Overview', to: '/faculty/dashboard', icon: BookOpen },
    { label: 'Assessments', to: '/faculty/assessments', icon: FileText },
    { label: 'Question Bank', to: '/faculty/questions', icon: BookOpen },
    { label: 'Evaluation', to: '/faculty/evaluation', icon: ClipboardCheck },
    { label: 'Analytics', to: '/faculty/analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-8">
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
            <p class="text-sm text-slate-500">Design assessments, monitor proctoring streams, and evaluate submissions.</p>
          </div>
          <button class="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all shrink-0">
            <Plus class="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assessments</p>
              <h3 class="text-3xl font-bold text-slate-900">1</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl text-primary">
              <FileText class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Evaluation Queue</p>
              <h3 class="text-3xl font-bold text-slate-900">0</h3>
            </div>
            <div class="p-3 bg-amber-50 rounded-xl text-amber-600">
              <ClipboardCheck class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pass Rate Avg</p>
              <h3 class="text-3xl font-bold text-slate-900">84%</h3>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Live Exams</p>
              <h3 class="text-3xl font-bold text-slate-900">0</h3>
            </div>
            <div class="p-3 bg-rose-50 rounded-xl text-rose-600">
              <PlayCircle class="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Scheduled Assessments */}
        <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-900">Upcoming Assessments</h3>
            <p class="text-xs text-slate-500">Scheduled exams pending release.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((exam) => (
              <div key={exam.id} class="border border-slate-100 hover:border-slate-200 rounded-2xl p-5 hover:shadow-premium transition-all bg-[#F8FAFC]">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span class="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-semibold rounded uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    <h4 class="font-bold text-slate-900 mt-2 text-base">{exam.title}</h4>
                  </div>
                  <span class="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {exam.status}
                  </span>
                </div>

                <div class="flex items-center space-x-6 text-xs text-slate-500 border-t border-slate-200/60 pt-4">
                  <div class="flex items-center space-x-1.5">
                    <Calendar class="w-4 h-4 text-slate-400" />
                    <span>{exam.date}</span>
                  </div>
                  <div class="flex items-center space-x-1.5">
                    <Clock class="w-4 h-4 text-slate-400" />
                    <span>{exam.time} ({exam.duration})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
