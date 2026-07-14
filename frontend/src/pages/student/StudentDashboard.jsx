import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getStudentDashboardOfflineExams } from './studentDashboardUtils';
import { 
  GraduationCap, Clipboard, FileCheck, Landmark, Clock, Award, PlayCircle, User as UserIcon
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActiveExams = async () => {
      const offlineExams = getStudentDashboardOfflineExams(user);
      if (offlineExams.length > 0) {
        setExams(offlineExams);
        setLoading(false);
        return;
      }

      try {
        const qs = [];
        if (user?.collegeId) qs.push(`collegeId=${encodeURIComponent(user.collegeId)}`);
        if (user?.departmentId) qs.push(`departmentId=${encodeURIComponent(user.departmentId)}`);
        if (user?.userId) qs.push(`studentId=${encodeURIComponent(user.userId)}`);
        const query = qs.length ? `?${qs.join('&')}` : '';
        const response = await api.get(`/assessments/active${query}`);
        // Defensive: ensure array
        if (Array.isArray(response.data)) {
          setExams(response.data);
        } else if (response.data) {
          console.warn('assessments/active returned non-array:', response.data);
          setExams([response.data]);
        } else {
          setExams([]);
        }

        // Fetch completed sessions count
        if (user?.userId) {
          const sessionsResponse = await api.get(`/exams/sessions/student/${user.userId}`);
          if (Array.isArray(sessionsResponse.data)) {
            const completed = sessionsResponse.data.filter(s => s.status === 'SUBMITTED' || s.status === 'FORCE_SUBMITTED');
            setCompletedCount(completed.length);
          }
        }
      } catch (err) {
        console.error('Error fetching active assessments', err);
        setError('Failed to fetch assigned assessments.');
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchActiveExams();
      const intervalId = setInterval(fetchActiveExams, 10000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: GraduationCap },
    { label: 'My Exams', to: '/student/exams', icon: Clipboard },
    { label: 'Exam History', to: '/student/history', icon: FileCheck },
    { label: 'Results', to: '/student/results', icon: Award },
    { label: 'Profile', to: '/student/profile', icon: UserIcon },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-8">
        {/* Welcome */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Welcome Back, {user?.fullName || 'Student'}</h1>
          <p class="text-sm text-slate-500">Monitor your exam calendar, read notifications, and review your performance analyses.</p>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming Exams</p>
              <h3 class="text-3xl font-bold text-slate-900">{exams.length}</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl text-primary">
              <Clipboard class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed Exams</p>
              <h3 class="text-3xl font-bold text-slate-900">{completedCount}</h3>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <FileCheck class="w-6 h-6" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">CGPA / Average Grade</p>
              <h3 class="text-3xl font-bold text-slate-900">N/A</h3>
            </div>
            <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Award class="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Available Exams Card List */}
        <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-900">Assigned Assessments</h3>
            <p class="text-xs text-slate-500">Exams currently available to launch or scheduled shortly.</p>
          </div>

          <div class="space-y-4">
            {exams.map((exam) => (
              <div 
                key={exam.id} 
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border border-slate-100 rounded-2xl bg-[#F8FAFC] hover:shadow-premium transition-all gap-4"
              >
                <div class="space-y-2">
                  <span class="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded uppercase tracking-wider">
                    {exam.subject?.name || exam.subject || 'Subject'}
                  </span>
                  <h4 class="font-bold text-slate-900 text-base">{exam.title}</h4>
                  <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                    <span class="flex items-center space-x-1">
                      <Landmark class="w-4 h-4 text-slate-400" />
                      <span>Duration: {exam.durationMinutes} mins</span>
                    </span>
                    <span class="flex items-center space-x-1">
                      <Clock class="w-4 h-4 text-slate-400" />
                      <span>Marks: {exam.totalMarks} Marks</span>
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/student/exam/${exam.id}/readiness`)}
                  class="flex items-center justify-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all shrink-0"
                >
                  <PlayCircle class="w-4 h-4" />
                  <span>Start System Check</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

          {/* Debug: show mock user/token to aid troubleshooting */}
          <div class="mt-4 text-xs text-slate-500">
            <strong>Debug:</strong>
            <div>User: {JSON.stringify(JSON.parse(localStorage.getItem('secureassess_user') || 'null'))}</div>
            <div>Token: {localStorage.getItem('secureassess_token') || 'none'}</div>
          </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
