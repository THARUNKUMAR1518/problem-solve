import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ShieldCheck, User as UserIcon, Bell } from 'lucide-react';

const DashboardLayout = ({ navItems, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'COLLEGE_ADMIN': return 'College Admin';
      case 'FACULTY': return 'Faculty';
      case 'STUDENT': return 'Student';
      default: return role;
    }
  };

  return (
    <div class="flex h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          class="fixed inset-0 z-40 bg-[#0F172A]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside class={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0F172A] text-white transition-transform duration-300 transform lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div class="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <ShieldCheck class="w-6 h-6 text-primary" />
            <span class="text-lg font-bold tracking-tight">SecureAssess</span>
          </div>
          <button 
            class="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              class={({ isActive }) => `
                flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <item.icon class="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Profile */}
        <div class="p-4 border-t border-slate-800 bg-[#0c1221]">
          <div 
            onClick={() => {
              if (user?.role === 'STUDENT') {
                navigate('/student/profile');
              }
            }}
            class={`flex items-center space-x-3 px-2 py-1.5 mb-2 rounded-xl transition-all duration-200 ${
              user?.role === 'STUDENT' ? 'cursor-pointer hover:bg-slate-800/40' : ''
            }`}
          >
            <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UserIcon class="w-5 h-5" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-semibold truncate text-slate-200">{user?.fullName}</h4>
              <p class="text-[10px] text-slate-500 font-medium truncate">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            class="flex items-center justify-center space-x-2 w-full px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition duration-200 border border-transparent hover:border-red-500/15"
          >
            <LogOut class="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header class="flex items-center justify-between h-16 px-6 lg:px-8 bg-white border-b border-slate-100 shrink-0">
          <div class="flex items-center space-x-4">
            <button 
              class="text-slate-600 hover:text-slate-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu class="w-6 h-6" />
            </button>
            <h2 class="text-lg font-bold text-[#0F172A]">Dashboard Overview</h2>
          </div>

          <div class="flex items-center space-x-4">
            {/* Notification Bell */}
            <button class="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Menu Badge */}
            <div class="flex items-center space-x-2.5 pl-2 border-l border-slate-100">
              <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-[#0F172A] rounded-lg">
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
