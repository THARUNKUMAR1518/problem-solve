import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Award, ArrowLeft, Download, CheckCircle2, AlertTriangle, FileText, Landmark, Clock, TrendingUp,
  GraduationCap, Clipboard, FileCheck, User as UserIcon
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ResultAnalysis = () => {
  const { id } = useParams(); // Result ID
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Performance calculations
  const [difficultyData, setDifficultyData] = useState({
    easyTotal: 0, easyCorrect: 0,
    mediumTotal: 0, mediumCorrect: 0,
    hardTotal: 0, hardCorrect: 0
  });

  const [scoreBreakdown, setScoreBreakdown] = useState({
    correct: 0,
    wrong: 0,
    unanswered: 0
  });

  const fetchAnalysis = async () => {
    setLoading(true);
    
    // Offline Simulation check
    if (id === 'mock-result-999') {
      setResult({
        id: 999,
        scoreObtained: 35.0,
        totalScore: 50.0,
        percentage: 70.0,
        percentile: 88.0,
        rank: 3,
        status: 'PASSED',
        assessment: { title: 'Data Structures Midterm' },
        examSession: { currentWarningCount: 1 }
      });
      setAnswers([]);
      setScoreBreakdown({
        correct: 2,
        wrong: 1,
        unanswered: 0
      });
      setDifficultyData({
        easyTotal: 1, easyCorrect: 1,
        mediumTotal: 1, mediumCorrect: 1,
        hardTotal: 1, hardCorrect: 0
      });
      setLoading(false);
      return;
    }

    try {
      const resData = await api.get(`/results/${id}`);
      setResult(resData.data);

      const sessionId = resData.data.examSession?.id;
      const ansRes = await api.get(`/exams/sessions/${sessionId}/answers`);
      setAnswers(ansRes.data);

      // Perform aggregation
      let easyT = 0, easyC = 0;
      let medT = 0, medC = 0;
      let hardT = 0, hardC = 0;
      let correct = 0, wrong = 0, unans = 0;

      ansRes.data.forEach(ans => {
        const difficulty = ans.question.difficulty;
        const isCorrect = ans.isCorrect;
        const answerVal = ans.studentAnswerJson;

        // Breakdown counts
        if (!answerVal || answerVal.trim() === "") {
          unans++;
        } else if (isCorrect === true) {
          correct++;
        } else {
          wrong++;
        }

        // Difficulty counts
        if (difficulty === 'EASY') {
          easyT++;
          if (isCorrect === true) easyC++;
        } else if (difficulty === 'MEDIUM') {
          medT++;
          if (isCorrect === true) medC++;
        } else if (difficulty === 'HARD') {
          hardT++;
          if (isCorrect === true) hardC++;
        }
      });

      setDifficultyData({
        easyTotal: easyT, easyCorrect: easyC,
        mediumTotal: medT, mediumCorrect: medC,
        hardTotal: hardT, hardCorrect: hardC
      });

      setScoreBreakdown({
        correct,
        wrong,
        unanswered: unans
      });

    } catch (err) {
      setError('Failed to load performance analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!result) return;
    if (id === 'mock-result-999') {
      alert('PDF generation is simulated offline! In production, this builds and downloads a secure, signed PDF of your score report card.');
      return;
    }
    try {
      const response = await api.get(`/results/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SecureAssess-Report-${result.assessment?.title.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download PDF report.');
    }
  };

  // Chart 1 Configurations: Score Breakdown Doughnut
  const doughnutData = {
    labels: ['Correct', 'Wrong', 'Unanswered'],
    datasets: [{
      data: [scoreBreakdown.correct, scoreBreakdown.wrong, scoreBreakdown.unanswered],
      backgroundColor: ['#10B981', '#EF4444', '#94A3B8'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 11, weight: '600' },
          padding: 15
        }
      }
    },
    cutout: '70%'
  };

  // Chart 2 Configurations: Difficulty Analysis Bar
  const barData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Correct Answers',
        data: [difficultyData.easyCorrect, difficultyData.mediumCorrect, difficultyData.hardCorrect],
        backgroundColor: '#2563EB',
        borderRadius: 6
      },
      {
        label: 'Total Questions',
        data: [difficultyData.easyTotal, difficultyData.mediumTotal, difficultyData.hardTotal],
        backgroundColor: '#E2E8F0',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 11, weight: '600' }
        }
      }
    }
  };

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: GraduationCap },
    { label: 'My Exams', to: '/student/exams', icon: Clipboard },
    { label: 'Exam History', to: '/student/history', icon: FileCheck },
    { label: 'Results', to: '/student/results', icon: Award },
    { label: 'Profile', to: '/student/profile', icon: UserIcon },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6">
        
        {/* Header */}
        <div class="flex items-center justify-between border-b border-slate-100 pb-5">
          <div class="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/student/results')}
              class="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-[#0F172A]">{result?.assessment?.title} Analysis</h1>
              <p class="text-xs text-slate-500 font-medium">Topic & Difficulty Strength breakdown reports</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            class="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all shrink-0"
          >
            <Download class="w-4.5 h-4.5" />
            <span>Download Certificate</span>
          </button>
        </div>

        {/* Quick Summary Grid */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 border border-slate-100 rounded-2xl shadow-card text-center sm:text-left">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Final Score</span>
            <h4 class="text-2xl font-bold text-slate-900 font-sans">{result?.scoreObtained} <span class="text-xs text-slate-400">/ {result?.totalScore}</span></h4>
          </div>

          <div class="bg-white p-5 border border-slate-100 rounded-2xl shadow-card text-center sm:text-left">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pass Status</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mt-2 ${
              result?.status === 'PASSED' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}>
              {result?.status}
            </span>
          </div>

          <div class="bg-white p-5 border border-slate-100 rounded-2xl shadow-card text-center sm:text-left">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Class Rank</span>
            <h4 class="text-2xl font-bold text-slate-900 font-sans">Rank {result?.rank}</h4>
          </div>

          <div class="bg-white p-5 border border-slate-100 rounded-2xl shadow-card text-center sm:text-left">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Percentile Rank</span>
            <h4 class="text-2xl font-bold text-slate-900 font-sans">{result?.percentile.toFixed(0)}th %</h4>
          </div>
        </div>

        {/* Analytics Charts Panels */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Doughnut */}
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium flex flex-col justify-between h-96 lg:col-span-1">
            <div>
              <h3 class="font-bold text-slate-900 text-sm">Response Accuracy</h3>
              <p class="text-[10px] text-slate-400 font-medium mb-4">Total correct vs wrong vs skipped answers.</p>
            </div>
            
            <div class="w-40 h-40 mx-auto">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            <div class="flex items-center justify-around border-t border-slate-100 pt-4 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <div class="text-center">
                <span class="text-emerald-600 block text-base font-bold">{scoreBreakdown.correct}</span>
                <span>Correct</span>
              </div>
              <div class="text-center">
                <span class="text-red-500 block text-base font-bold">{scoreBreakdown.wrong}</span>
                <span>Wrong</span>
              </div>
              <div class="text-center">
                <span class="text-slate-400 block text-base font-bold">{scoreBreakdown.unanswered}</span>
                <span>Skipped</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Bar */}
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium flex flex-col justify-between h-96 lg:col-span-2">
            <div>
              <h3 class="font-bold text-slate-900 text-sm">Difficulty Level Analysis</h3>
              <p class="text-[10px] text-slate-400 font-medium mb-4">Accuracy and answers completed grouped by question difficulty weighting.</p>
            </div>

            <div class="flex-1 max-h-64 flex items-center justify-center">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Proctoring Log in Report Card */}
        {result?.examSession?.currentWarningCount > 0 && (
          <div class="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl text-xs font-medium leading-relaxed font-sans">
            <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong class="font-bold text-amber-950">Proctor Incident Log Summary:</strong> A total of <strong>{result?.examSession?.currentWarningCount}</strong> focus or camera alerts were recorded by the anti-cheating browser engine during this examination session. This audit metadata was submitted to college administrations for compliance vetting.
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ResultAnalysis;
