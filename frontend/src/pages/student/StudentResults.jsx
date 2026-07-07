import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  GraduationCap, Clipboard, FileCheck, Award, Download, BarChart2, AlertCircle, FileText, CheckCircle, XCircle
} from 'lucide-react';

const StudentResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      const response = await api.get(`/results/student/${user.userId}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [user.userId]);

  const handleDownloadPDF = async (resultId, examTitle) => {
    try {
      const response = await api.get(`/results/${resultId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SecureAssess-Report-${examTitle.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download PDF report.');
    }
  };

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: GraduationCap },
    { label: 'My Exams', to: '/student/exams', icon: Clipboard },
    { label: 'Exam History', to: '/student/history', icon: FileCheck },
    { label: 'Results', to: '/student/results', icon: Award },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        {/* Header */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900 font-sans">Examination Results</h1>
          <p class="text-sm text-slate-500 font-medium">Verify score percentages, pass criteria, and retrieve authenticated report credentials.</p>
        </div>

        {/* Results view */}
        {loading ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center">
            <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm text-slate-500 font-medium">Loading report cards...</p>
          </div>
        ) : results.length === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-16 text-center font-sans">
            <Award class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-900 mb-1">No Results Published</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto font-medium">Your graded assessments and score analysis reports will be listed here once reviewed.</p>
          </div>
        ) : (
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Title</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Percentage</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank / Percentile</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Reports</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {results.map((res) => (
                    <tr key={res.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-slate-900">{res.assessment?.title}</div>
                        <div class="text-[10px] text-slate-400 font-mono mt-0.5">{res.assessment?.subject?.name}</div>
                      </td>
                      <td class="px-6 py-4 text-xs font-bold text-slate-700">
                        {res.scoreObtained} / {res.totalScore}
                      </td>
                      <td class="px-6 py-4 text-xs font-semibold text-slate-600">
                        {res.percentage.toFixed(1)}%
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-500 font-medium">
                        Rank {res.rank} ({res.percentile.toFixed(0)}th percentile)
                      </td>
                      <td class="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          res.status === 'PASSED' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {res.status === 'PASSED' ? <CheckCircle class="w-3 h-3" /> : <XCircle class="w-3 h-3" />}
                          <span>{res.status}</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2 shrink-0">
                        <button 
                          onClick={() => handleDownloadPDF(res.id, res.assessment.title)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center space-x-1"
                          title="Download PDF Certificate"
                        >
                          <Download class="w-4 h-4" />
                          <span class="text-[10px] font-semibold hidden md:inline">PDF</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/student/results/${res.id}/analysis`)}
                          class="p-1.5 hover:bg-slate-100 rounded-lg text-primary hover:text-primary-hover transition-colors inline-flex items-center space-x-1"
                          title="View Analysis Dashboard"
                        >
                          <BarChart2 class="w-4 h-4" />
                          <span class="text-[10px] font-semibold hidden md:inline">Analytics</span>
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

export default StudentResults;
