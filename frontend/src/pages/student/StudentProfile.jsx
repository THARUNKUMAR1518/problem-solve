import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, Clipboard, FileCheck, Award, User as UserIcon, Mail, Phone, MapPin, Shield, Activity, FileText, CheckCircle, Save
} from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  
  // Profile form states
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [address, setAddress] = useState('100 Academic Way, Campus District, NY 10001');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: GraduationCap },
    { label: 'My Exams', to: '/student/exams', icon: Clipboard },
    { label: 'Exam History', to: '/student/history', icon: FileCheck },
    { label: 'Results', to: '/student/results', icon: Award },
    { label: 'Profile', to: '/student/profile', icon: UserIcon },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div class="space-y-6 font-sans">
        {/* Title Block */}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Student Profile Dashboard</h1>
          <p class="text-sm text-slate-500 font-medium">Verify your institutional registration records, security credentials, and academic statistics.</p>
        </div>

        {/* Saved Toast Alert */}
        {isSaved && (
          <div class="flex items-center space-x-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold animate-pulse">
            <CheckCircle class="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Summary card */}
          <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6 flex flex-col items-center justify-between text-center lg:col-span-1">
            <div class="space-y-4 w-full flex flex-col items-center">
              <div class="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <UserIcon class="w-12 h-12" />
              </div>

              <div>
                <h3 class="text-lg font-bold text-slate-900">{user?.fullName || 'John Doe'}</h3>
                <span class="px-2.5 py-0.5 bg-slate-100 text-[#0F172A] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Verified Student Account
                </span>
              </div>

              <div class="w-full border-t border-slate-100/60 pt-4 text-left space-y-3">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Institutional Branch</span>
                  <span class="text-xs font-semibold text-slate-800">Information Technology (B.Tech)</span>
                </div>
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">College Campus</span>
                  <span class="text-xs font-semibold text-slate-800">Apex Engineering College</span>
                </div>
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Academic ID Tag</span>
                  <span class="text-xs font-semibold text-slate-500 font-mono">{user?.userId || 'u-student-1'}</span>
                </div>
              </div>
            </div>

            <div class="w-full border-t border-slate-100/60 pt-4 mt-6">
              <span class="text-[10px] font-semibold text-slate-400">Account status: </span>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active & Secure</span>
            </div>
          </div>

          {/* Right Column: Profile Form Details & Academic stats */}
          <div class="lg:col-span-2 space-y-6">
            {/* Academic stats box */}
            <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Activity class="w-4 h-4 text-primary shrink-0" />
                <span>Academic Record Highlights</span>
              </h3>

              <div class="grid grid-cols-3 gap-4">
                <div class="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CGPA Average</span>
                  <h4 class="text-xl font-bold text-slate-900 mt-1">8.7 <span class="text-[10px] text-slate-400 font-normal">/ 10</span></h4>
                </div>

                <div class="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Exams Taken</span>
                  <h4 class="text-xl font-bold text-slate-900 mt-1">2</h4>
                </div>

                <div class="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Passed Rate</span>
                  <h4 class="text-xl font-bold text-emerald-600 mt-1">100%</h4>
                </div>
              </div>
            </div>

            {/* Profile Form card */}
            <div class="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <FileText class="w-4 h-4 text-primary shrink-0" />
                <span>Contact & Personal Details</span>
              </h3>

              <form onSubmit={handleSave} class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Registered Name</label>
                    <div class="relative">
                      <UserIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        readOnly 
                        value={user?.fullName || 'John Doe'} 
                        class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-xs outline-none cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Official Student Email</label>
                    <div class="relative">
                      <Mail class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email" 
                        readOnly 
                        value={user?.email || 'student@secureassess.com'} 
                        class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-xs outline-none cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                    <div class="relative">
                      <Phone class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-primary text-slate-800 rounded-xl text-xs outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campus Residential Address</label>
                    <div class="relative">
                      <MapPin class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-primary text-slate-800 rounded-xl text-xs outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex items-center space-x-1.5 text-[10px] font-medium text-slate-400">
                    <Shield class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Identity verified by college administrator.</span>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={saving}
                    class="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/10 transition-all disabled:opacity-60"
                  >
                    <Save class="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
