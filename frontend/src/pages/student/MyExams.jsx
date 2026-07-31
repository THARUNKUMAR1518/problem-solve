import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  GraduationCap, Clipboard, FileCheck, Award, User as UserIcon, Landmark, Clock, PlayCircle, Search, Info
} from 'lucide-react';

const MyExams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const qs = [];
        if (user?.collegeId) qs.push(`collegeId=${encodeURIComponent(user.collegeId)}`);
        if (user?.departmentId) qs.push(`departmentId=${encodeURIComponent(user.departmentId)}`);
        if (user?.userId) qs.push(`studentId=${encodeURIComponent(user.userId)}`);
        const query = qs.length ? `?${qs.join('&')}` : '';
        const response = await api.get(`/assessments/active${query}`);
        if (Array.isArray(response.data)) {
          setExams(response.data);
        } else if (response.data) {
          setExams([response.data]);
        } else {
          setExams([]);
        }
      } catch (err) {
        console.error('Error fetching assessments', err);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchExams();
      const intervalId = setInterval(fetchExams, 10000);
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

  const filteredExams = exams.filter(exam => 
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exam.subject?.name || exam.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6 font-sans">
        {/* Title Block */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">My Assigned Exams</h1>
          <p class="text-sm text-slate-500 font-medium">View and complete scheduled or active assessments assigned to your branch.</p>
        </div>

        {/* Search bar and Filters */}
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div class="relative w-full sm:max-w-xs">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by subject or exam..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium"
            />
          </div>
          <span class="text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
            Total Available: {filteredExams.length}
          </span>
        </div>

        {/* Exams Content */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Checking active calendar...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <Clipboard class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Active Exams Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto font-medium">There are currently no active assessments assigned to your profile matching your criteria.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExams.map((exam) => (
              <div 
                key={exam.id} 
                class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6 flex flex-col justify-between hover:shadow-hover transition-all duration-200"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                      {exam.subject?.name || exam.subject || 'Subject'}
                    </span>
                    <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-0.5"></span>
                      <span>ACTIVE NOW</span>
                    </span>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-bold text-slate-900">{exam.title}</h3>
                    <p class="text-xs text-slate-500 mt-1 line-clamp-2">This exam is supervised by secure AI-proctoring monitors. Make sure your workspace is ready.</p>
                  </div>

                  <div class="flex items-center gap-6 text-xs text-slate-500 font-medium pt-2 border-t border-slate-100/60">
                    <span class="flex items-center space-x-1.5">
                      <Landmark class="w-4 h-4 text-slate-400" />
                      <span>Duration: {exam.durationMinutes} mins</span>
                    </span>
                    <span class="flex items-center space-x-1.5">
                      <Clock class="w-4 h-4 text-slate-400" />
                      <span>Marks: {exam.totalMarks} Marks</span>
                    </span>
                  </div>
                </div>

                <div class="pt-6">
                  <button 
                    onClick={() => navigate(`/student/exam/${exam.id}/readiness`)}
                    class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all"
                  >
                    <PlayCircle class="w-4 h-4" />
                    <span>Launch System Check</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info card */}
        <div class="flex items-start space-x-3 p-4 bg-blue-50/50 border border-blue-100 text-blue-900 rounded-2xl text-xs font-medium leading-relaxed">
          <Info class="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <strong class="font-bold text-blue-950">Important Proctoring Notice:</strong> Ensure you are in a quiet, well-lit room, and your browser permissions for microphone and camera access are enabled. Dual-monitor setups are strictly disallowed during assessment sessions.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyExams;
