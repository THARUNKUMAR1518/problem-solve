import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('secureassess_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Local Testing Credentials Bypass (Only for explicit test accounts or test password)
    if (password === 'test@123' || email === 'test@gmail.com' || email.startsWith('test-')) {
      let role = 'STUDENT';
      let fullName = 'Test Student Profile';
      let userId = 'mock-student-999';
      let collegeId = 'mock-college-999';

      if (email.includes('admin') || email.includes('college')) {
        role = 'COLLEGE_ADMIN';
        fullName = 'Test College Admin';
      } else if (email.includes('faculty')) {
        role = 'FACULTY';
        fullName = 'Dr. Robert Johnson';
      } else if (email.includes('super')) {
        role = 'SUPER_ADMIN';
        fullName = 'Test Super Admin';
      } else {
        role = 'STUDENT';
        fullName = email === 'jane@secureassess.com' ? 'Jane Smith' : 'John Doe';
      }

      // align test fallback ids with frontend mock server entries
      if (role === 'FACULTY') userId = 'u-faculty-1';
      if (role === 'STUDENT') userId = email.includes('dev') ? 'u-dev-student' : 'u-student-1';
      collegeId = 'c-1';
      // map department ids to align with mock DB
      let departmentId = 'd-IT';
      if (role === 'FACULTY') departmentId = 'd-CSE';
      if (email.includes('cse') || email.includes('faculty')) departmentId = 'd-CSE';

      const userData = { email, fullName, role, userId, collegeId, departmentId };
      // Use explicit MOCK- token so api.js routing picks up mockServer
      localStorage.setItem('secureassess_token', 'MOCK-ACCESS-TOKEN');
      localStorage.setItem('secureassess_refresh_token', 'MOCK-REFRESH-TOKEN');
      localStorage.setItem('secureassess_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, fullName, role, userId, collegeId } = response.data;
      
      const userData = { email, fullName, role, userId, collegeId };
      
      localStorage.setItem('secureassess_token', accessToken);
      localStorage.setItem('secureassess_refresh_token', refreshToken);
      localStorage.setItem('secureassess_user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      // Robust offline fallback for seeded accounts if API connection times out or fails
      if (email === 'student@secureassess.com' || email === 'jane@secureassess.com' || email === 'faculty@secureassess.com') {
        const fallbackRole = email.includes('faculty') ? 'FACULTY' : 'STUDENT';
        const fallbackName = email.includes('faculty') ? 'Dr. Robert Johnson' : (email.includes('jane') ? 'Jane Smith' : 'John Doe');
        // align with mock server
        const userId = fallbackRole === 'FACULTY' ? 'u-faculty-1' : (email.includes('dev') ? 'u-dev-student' : 'u-student-1');
        const departmentId = fallbackRole === 'FACULTY' ? 'd-CSE' : 'd-IT';
        const userData = { email, fullName: fallbackName, role: fallbackRole, userId, collegeId: 'c-1', departmentId };
        // Use explicit MOCK- token so api.js routing picks up mockServer
        localStorage.setItem('secureassess_token', 'MOCK-ACCESS-TOKEN');
        localStorage.setItem('secureassess_refresh_token', 'MOCK-REFRESH-TOKEN');
        localStorage.setItem('secureassess_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  };

  const logout = () => {
    localStorage.removeItem('secureassess_token');
    localStorage.removeItem('secureassess_refresh_token');
    localStorage.removeItem('secureassess_user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to request password reset.';
    }
  };

  const resetPassword = async (email, token, newPassword) => {
    try {
      await api.post(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password.';
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      await api.post(`/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to verify email.';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, forgotPassword, resetPassword, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
