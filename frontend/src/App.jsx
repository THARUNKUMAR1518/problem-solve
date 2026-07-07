import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// Layouts & Page placeholders (to be expanded in subsequent phases)
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import CollegeAdminDashboard from './pages/collegeadmin/CollegeAdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Administration CRUD Pages
import Colleges from './pages/superadmin/Colleges';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Subjects from './pages/Subjects';
import Faculty from './pages/collegeadmin/Faculty';
import Students from './pages/collegeadmin/Students';

// Faculty CRUD & Evaluation Pages
import Assessments from './pages/faculty/Assessments';
import Questions from './pages/faculty/Questions';
import QuestionBank from './pages/faculty/QuestionBank';
import Evaluation from './pages/faculty/Evaluation';

// Student Exam Pages
import ReadinessCheck from './pages/student/ReadinessCheck';
import ExamSession from './pages/student/ExamSession';
import StudentResults from './pages/student/StudentResults';
import ResultAnalysis from './pages/student/ResultAnalysis';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-screen bg-slate-50">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-slate-500">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-screen bg-slate-50">
        <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/super-admin/dashboard" replace />;
    case 'COLLEGE_ADMIN':
      return <Navigate to="/college-admin/dashboard" replace />;
    case 'FACULTY':
      return <Navigate to="/faculty/dashboard" replace />;
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const Unauthorized = () => (
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-50">
    <h1 class="text-4xl font-bold text-slate-900 mb-2">Access Denied</h1>
    <p class="text-slate-600 mb-4">You do not have the required permissions to view this resource.</p>
    <a href="/" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium transition duration-200">
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Root Redirector */}
          <Route path="/" element={<DashboardRedirect />} />

          {/* Super Admin Protected Routes */}
          <Route path="/super-admin/*" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="colleges" element={<Colleges />} />
                <Route path="departments" element={<Departments />} />
                <Route path="courses" element={<Courses />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* College Admin Protected Routes */}
          <Route path="/college-admin/*" element={
            <ProtectedRoute allowedRoles={['COLLEGE_ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<CollegeAdminDashboard />} />
                <Route path="departments" element={<Departments />} />
                <Route path="courses" element={<Courses />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="faculty" element={<Faculty />} />
                <Route path="students" element={<Students />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Faculty Protected Routes */}
          <Route path="/faculty/*" element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <Routes>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="assessments" element={<Assessments />} />
                <Route path="assessments/:id/questions" element={<Questions />} />
                <Route path="questions" element={<QuestionBank />} />
                <Route path="evaluation" element={<Evaluation />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Student Protected Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="exam/:id/readiness" element={<ReadinessCheck />} />
                <Route path="exam/:id/session" element={<ExamSession />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="results/:id/analysis" element={<ResultAnalysis />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
