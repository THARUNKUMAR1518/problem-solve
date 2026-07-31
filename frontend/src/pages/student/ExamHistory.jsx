import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  GraduationCap, Clipboard, FileCheck, Award, User as UserIcon, CheckCircle2, Search, ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';

const ExamHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/exams/sessions/student/${user.userId}`);
        if (Array.isArray(response.data)) {
          const completed = response.data.filter(s => s.status === 'SUBMITTED' || s.status === 'FORCE_SUBMITTED');
          const mapped = completed.map(s => {
            const totalScore = s.result ? s.result.totalMarks : (s.assessment ? s.assessment.totalMarks : 100);
            const scoreObtained = s.result ? s.result.obtainedMarks : 0;
            const percentage = totalScore > 0 ? (scoreObtained / totalScore) * 100 : 0;
            const status = percentage >= 50 ? 'PASSED' : 'FAILED';
            const duration = s.completedAt 
              ? `${Math.round((new Date(s.completedAt) - new Date(s.startedAt)) / 60000)} mins`
              : 'N/A';

            return {
              id: s.id,
              title: s.assessment ? s.assessment.title : 'Assessment',
              subjectName: s.assessment ? s.assessment.subjectName || s.assessment.subject?.name || 'Subject' : 'Subject',
              dateCompleted: s.completedAt ? s.completedAt.split('T')[0] : s.startedAt.split('T')[0],
              scoreObtained,
              totalScore,
              percentage,
              status,
              warnings: (s.violationLogs || []).length,
              durationSpent: duration
            };
          });
          setHistory(mapped);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchHistory();
    }
  }, [user]);

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: GraduationCap },
    { label: 'My Exams', to: '/student/exams', icon: Clipboard },
    { label: 'Exam History', to: '/student/history', icon: FileCheck },
    { label: 'Results', to: '/student/results', icon: Award },
    { label: 'Profile', to: '/student/profile', icon: UserIcon },
  ];

  const filteredHistory = history.filter(hist => 
    hist.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hist.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6 font-sans">
        {/* Title Block */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Exam History & Archives</h1>
          <p class="text-sm text-slate-500 font-medium">Verify your completed exams, session durations, proctoring warning tallies, and grading status.</p>
        </div>

        {/* Search bar and Filters */}
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <div class="relative w-full sm:max-w-xs">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search past exams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium"
            />
          </div>
          <span class="text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
            Total Completed: {filteredHistory.length}
          </span>
        </div>

        {/* History Table/List */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Loading exam records...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center">
            <FileCheck class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Exam Records Found</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto font-medium">No archived or submitted exam sheets correspond to your search criteria.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment Details</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Date</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration Used</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proctor Flags</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-slate-900">{item.title}</div>
                        <div class="text-[10px] text-slate-400 font-mono mt-0.5">{item.subjectName}</div>
                      </td>
                      <td class="px-6 py-4 text-xs font-medium text-slate-600">
                        {item.dateCompleted}
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-500 font-mono">
                        {item.durationSpent}
                      </td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.warnings === 0 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                        }`}>
                          {item.warnings === 0 ? 'Clean Sheet' : `${item.warnings} Warning(s)`}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 class="w-3 h-3 text-emerald-600 mr-0.5" />
                          <span>{item.status} ({item.percentage.toFixed(0)}%)</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate('/student/results')}
                          class="inline-flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                          <span>View Report</span>
                          <ArrowUpRight class="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamHistory;
