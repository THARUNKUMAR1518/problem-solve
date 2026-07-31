import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  Brain,
  FileText,
  LineChart,
  GraduationCap,
  Globe,
  ArrowRight,
  User,
  Menu,
  X,
  Check,
  Sparkles,
  Monitor,
  Cpu,
  Mail,
  Phone,
  MapPin,
  LockKeyhole
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [activeTab, setActiveTab] = useState('student');

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo matches top-left of image */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Proctored IQ</span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider mt-1 uppercase">AI-Powered Assessment Platform</span>
            </div>
          </div>

          {/* Nav Links with active indicator matching center of image */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-bold text-primary relative py-1">
              Home
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></span>
            </button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1">About</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1">How It Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1">Contact</button>
          </nav>

          {/* Login Button matches top-right of image */}
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-5 py-2.5 border border-slate-900 text-slate-900 font-semibold rounded-full hover:bg-slate-900 hover:text-white transition-all duration-200 text-sm shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-6 py-2.5 border border-slate-800 text-slate-800 font-semibold rounded-full hover:bg-slate-800 hover:text-white transition-all duration-200 text-sm"
              >
                <User className="w-4 h-4" />
                <span>Login / Signup</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:text-slate-900">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu list */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-5 duration-200">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 px-3 rounded-lg text-primary font-medium hover:bg-slate-50">Home</button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50">About</button>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50">How It Works</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Contact</button>
            <hr className="my-2 border-slate-100" />
            <button onClick={() => navigate('/login')} className="flex items-center justify-center space-x-2 w-full py-2.5 border border-slate-800 text-slate-800 font-semibold rounded-full text-sm">
              <User className="w-4 h-4" />
              <span>Login / Signup</span>
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-28 lg:pt-36 pb-20 overflow-hidden bg-white min-h-[640px] flex flex-col justify-between">
        
        {/* Background Wave matches right-side of image */}
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 overflow-hidden hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#051C45" />
                <stop offset="100%" stopColor="#0B377A" />
              </linearGradient>
            </defs>
            <path d="M 35,0 C 15,35 55,65 15,100 L 100,100 L 100,0 Z" fill="url(#wave-grad)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content matches exactly the typography & layout of image */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight leading-tight">
                  Welcome to
                </h1>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2563EB] tracking-tight leading-tight">
                  Proctored IQ
                </h1>
              </div>

              {/* Blue accent bar */}
              <div className="w-12 h-1 bg-[#2563EB] rounded-full my-4"></div>

              {/* Subheading lines */}
              <div className="space-y-1 text-slate-850 font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
                <p>AI-Based. Highly Secure. Fully Proctored.</p>
                <p className="text-slate-800">The Future of Online Assessments.</p>
              </div>

              {/* Features Horizontal layout exactly as image */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 py-6 border-b border-slate-100">
                
                {/* Feature 1 */}
                <div className="space-y-2 pr-1 border-r border-slate-200 flex flex-col items-start justify-between min-h-[85px]">
                  <div className="text-primary hover:scale-105 transition-transform duration-200">
                    <Brain className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">
                    AI-Powered <br />Question Generation
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="space-y-2 px-1 border-r border-slate-200 flex flex-col items-start justify-between min-h-[85px] sm:pl-3">
                  <div className="text-primary hover:scale-105 transition-transform duration-200">
                    <Shield className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">
                    Advanced <br />Proctoring
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="space-y-2 px-1 border-r border-slate-200 flex flex-col items-start justify-between min-h-[85px] sm:pl-3">
                  <div className="text-primary hover:scale-105 transition-transform duration-200">
                    <FileText className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">
                    Auto Evaluation <br />& Reporting
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="space-y-2 pl-1 flex flex-col items-start justify-between min-h-[85px] sm:pl-3">
                  <div className="text-primary hover:scale-105 transition-transform duration-200">
                    <LineChart className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">
                    Real-time <br />Analytics
                  </p>
                </div>

              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-200 bg-white text-slate-500 hover:text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Graphics matches right-side compositions of image */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-6">
              
              {/* Mobile background wave card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#051C45] to-[#0A326E] rounded-3xl lg:hidden -z-10 shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
              </div>

              {/* FLOATING BADGES */}
              
              {/* AI Circuit badge */}
              <div className="absolute top-[8%] left-[2%] xl:left-[6%] w-12 h-12 bg-blue-600/90 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/20 text-white z-20 hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>

              {/* Secure Lock Badge */}
              <div className="absolute top-[5%] right-[10%] xl:right-[15%] w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/10 text-white backdrop-blur-md z-15 hover:scale-105 transition-transform">
                <Lock className="w-6 h-6 text-blue-300" />
              </div>

              {/* LAPTOP GRAPHIC DESIGN */}
              <div className="relative w-full max-w-[430px] mx-auto z-10 px-4 md:px-0">
                
                {/* LAPTOP SCREEN */}
                <div className="relative bg-slate-800 rounded-t-2xl p-2 pb-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700">
                  <div className="relative aspect-[16/10] bg-[#F1F5F9] rounded-lg overflow-hidden border border-slate-900 flex flex-col justify-between">
                    
                    {/* Screen Header */}
                    <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">Online Assessment</span>
                      </div>
                      <div className="flex items-center space-x-1 border border-slate-200 rounded-md px-1.5 py-0.5 bg-slate-50">
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-ping"></span>
                        <span className="text-[8px] font-mono text-slate-700">01:29:45</span>
                      </div>
                    </div>

                    {/* Dashboard Layout inside screen */}
                    <div className="flex-1 grid grid-cols-12 gap-2 p-2 bg-slate-100">
                      
                      {/* Left: Numbers sidebar */}
                      <div className="col-span-2 bg-white rounded-md p-1.5 border border-slate-200/60 flex flex-col space-y-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className={`w-full aspect-square flex items-center justify-center rounded text-[9px] font-bold ${
                              num === 1
                                ? 'bg-primary text-white'
                                : 'bg-slate-50 text-slate-400 border border-slate-200/50'
                            }`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>

                      {/* Middle: Assessment Question options */}
                      <div className="col-span-6 bg-white rounded-md p-2.5 border border-slate-200/60 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-bold text-slate-800 leading-tight">
                            Select correct choice:
                          </h4>
                          <div className="space-y-1.5 text-[8px] text-slate-600">
                            <label className="flex items-center space-x-2 p-1 bg-slate-50 rounded border border-transparent">
                              <input type="radio" name="assessment-opt" className="w-2 h-2 text-primary" />
                              <span>Option A</span>
                            </label>
                            <label className="flex items-center space-x-2 p-1 bg-blue-50/50 rounded border border-primary/20">
                              <input type="radio" name="assessment-opt" className="w-2 h-2 text-primary" defaultChecked />
                              <span className="font-semibold text-primary">Option B</span>
                            </label>
                            <label className="flex items-center space-x-2 p-1 bg-slate-50/50 rounded border border-transparent">
                              <input type="radio" name="assessment-opt" className="w-2 h-2 text-primary" />
                              <span>Option C</span>
                            </label>
                            <label className="flex items-center space-x-2 p-1 bg-slate-50/50 rounded border border-transparent">
                              <input type="radio" name="assessment-opt" className="w-2 h-2 text-primary" />
                              <span>Option D</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button className="px-3 py-1 bg-primary text-white text-[8px] font-bold rounded hover:bg-primary-hover shadow-sm">
                            Next
                          </button>
                        </div>
                      </div>

                      {/* Right: Camera Stream */}
                      <div className="col-span-4 bg-slate-900 rounded-md overflow-hidden relative border border-slate-900 flex flex-col justify-between p-1.5">
                        
                        {/* Avatar */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 bg-gradient-to-b from-slate-800 to-slate-900">
                          <User className="w-9 h-9 text-slate-400 mt-2" />
                        </div>

                        {/* Tag */}
                        <div className="z-10 bg-red-600/90 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-sm flex items-center space-x-0.5 w-max">
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                          <span>Recording...</span>
                        </div>

                        {/* Blue lock tag */}
                        <div className="z-10 flex justify-end">
                          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white">
                            <LockKeyhole className="w-2.5 h-2.5" />
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>

                {/* LAPTOP KEYBOARD BASE */}
                <div className="relative bg-slate-700 h-2 rounded-b-xl shadow-xl flex justify-center">
                  <div className="w-12 h-[3px] bg-slate-800 rounded-b"></div>
                </div>

                {/* WEBCAM DEVICE NEXT TO LAPTOP */}
                <div className="absolute right-[-20px] bottom-[30px] z-20 flex flex-col items-center">
                  {/* Webcam body */}
                  <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-slate-700 shadow-md flex items-center justify-center relative">
                    <div className="w-5 h-5 bg-slate-950 rounded-full border border-blue-900/50 flex items-center justify-center relative">
                      <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full top-0.5 left-0.5 opacity-70"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#2563EB] animate-pulse"></div>
                    </div>
                  </div>
                  {/* Stand Neck */}
                  <div className="w-1 h-6 bg-slate-800 border-x border-slate-700"></div>
                  {/* Base */}
                  <div className="w-8 h-1.5 bg-slate-900 rounded-t border-b border-slate-950"></div>
                </div>

                {/* FLOATING GLOSSY SHIELD CHECK BADGE */}
                <div className="absolute bottom-[-15px] right-[25%] z-20 bg-gradient-to-tr from-primary to-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 hover:scale-105 transition-transform cursor-pointer">
                  <ShieldCheck className="w-6 h-6" />
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CAPSULE BAR Matches exactly the bottom bar in image */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 mb-4 relative z-10">
          <div className="bg-[#0B1528] rounded-2xl md:rounded-full p-4 md:px-8 md:py-4 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              
              {/* Item 1 */}
              <div className="flex items-center space-x-3 text-white justify-center md:justify-start py-2 md:py-0">
                <Lock className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Secure & Reliable</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center space-x-3 text-white justify-center md:justify-start py-2 md:py-0 md:pl-6">
                <GraduationCap className="w-6 h-6 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">For Institutions & Individuals</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center space-x-3 text-white justify-center md:justify-start py-2 md:py-0 md:pl-6">
                <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Accessible Anywhere</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center space-x-3 text-white justify-center md:justify-start py-2 md:py-0 md:pl-6">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Trusted Assessments</span>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">About Proctored IQ</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Reimagining integrity in digital education and evaluation.
            </p>
            <p className="text-lg text-slate-500">
              Proctored IQ is an AI-driven online assessment platform designed for universities, corporate training, and certification providers. We ensure complete exam fairness while maintaining a frictionless student experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Integrity Engine</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our lightweight algorithms verify candidate identity, detect secondary screens, check environment audio, and track eye gaze without demanding excessive internet bandwidth.
              </p>
            </div>

            {/* Privacy Shield Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy & Compliance</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Privacy-first architecture. Video and audio recordings are securely encrypted and comply strictly with FERPA, GDPR, and global student data storage compliance rules.
              </p>
            </div>

            {/* Usability Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-primary flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Student-Centric UI</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Minimal distraction design. Easy hardware checks, simple visual guidelines, and supportive status updates ensure students can focus purely on scoring their best.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Advanced Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A comprehensive suite of academic evaluation tools.
            </p>
            <p className="text-lg text-slate-500">
              Go beyond simple online tests. Leverage generative AI and advanced analytics to optimize test lifecycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="group bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-2xl border border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2">AI Question Gen</h3>
              <p className="text-slate-500 group-hover:text-slate-350 text-xs leading-relaxed">
                Feed your textbook or course syllabus, and let the AI generate customized MCQ, short answer, or coding challenges mapped to bloom's taxonomy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-2xl border border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2">Live Proctors</h3>
              <p className="text-slate-500 group-hover:text-slate-350 text-xs leading-relaxed">
                Auto-flags alert physical proctors in real-time, allowing them to review video events, text candidates in-app, or pause suspect sessions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-2xl border border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2">Smart Grading</h3>
              <p className="text-slate-500 group-hover:text-slate-350 text-xs leading-relaxed">
                Our code compilation box automatically tests programs, and language models parse essay responses against instructor-approved rubric maps.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-2xl border border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2">Integrity Score</h3>
              <p className="text-slate-500 group-hover:text-slate-350 text-xs leading-relaxed">
                Receive an aggregated integrity index per exam session, calculated from facial detection alerts, audio flags, tab switching, and copy-paste detection.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">How It Works</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              An effortless workflow for instructors and students alike.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-slate-200/60 p-1 rounded-full flex">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'student'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'faculty'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Instructors
              </button>
            </div>
          </div>

          {activeTab === 'student' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">1</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Log In & Select</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Log in securely. Your student portal will display active exams, mock assessments, and previous history.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">2</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Hardware Check</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Run a rapid 30-second diagnostics checks to verify your webcam, mic, screen share permissions, and network.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">3</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Take Assessment</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Start the exam. The AI quietly analyzes integrity markers in the background while you focus on writing answers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">4</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Instant Insights</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Submit to get automated grading immediately for MCQs, with reports and code test coverage logs instantly visible.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">1</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Create Exam</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Define exam duration, set passing scores, and pick integrity configurations like browser lock or mandatory mic.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">2</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Deploy AI Gen</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Save time using our AI prompt generator to draft customized test questions, tailoring difficulties and scoring models.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">3</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Monitor Live</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Open the Faculty console. Check active sessions, and review high-integrity flags immediately raised by the algorithm.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm shadow-md">4</div>
                <h4 className="text-base font-bold text-slate-900 mb-2 mt-2">Evaluate & Export</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Grade coding files and subjective questions manually using the split console, then export spreadsheets directly.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Pricing Plans</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Flexible options for organizations of all sizes.
            </p>
            
            <div className="flex items-center justify-center space-x-3 pt-4">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors duration-200 focus:outline-none relative"
              >
                <div className={`w-4 h-4 bg-primary rounded-full transition-transform duration-200 transform ${billingPeriod === 'yearly' ? 'translate-x-6' : ''}`}></div>
              </button>
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-slate-900 font-semibold' : 'text-slate-500'} flex items-center space-x-1.5`}>
                <span>Yearly</span>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Plan 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Basic Pilot</h3>
                  <p className="text-slate-500 text-xs mt-1">Perfect for trial departments & testing centers.</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black tracking-tight text-slate-950">
                    ${billingPeriod === 'monthly' ? '49' : '39'}
                  </span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <hr className="border-slate-200" />
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Up to 150 exams / month</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Standard AI Face detection</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Browser active-tab tracking</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>7 days recording logs retention</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => navigate('/login')} className="w-full mt-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Plan 2: Recommended */}
            <div className="bg-[#0F172A] text-white p-8 rounded-2xl border-2 border-primary flex flex-col justify-between relative shadow-xl scale-105 hover:scale-[1.07] transition-transform z-10">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">University Professional</h3>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Excellent for standard colleges & training institutes.</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black tracking-tight">
                    ${billingPeriod === 'monthly' ? '199' : '159'}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>
                <hr className="border-slate-800" />
                <ul className="space-y-3.5 text-xs text-slate-350">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-white font-medium">Up to 1,000 exams / month</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>AI Gaze tracker & voice detection</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Full secure exam browser block</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>AI question generator (1,000 requests)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>30 days recording logs retention</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => navigate('/login')} className="w-full mt-8 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-hover shadow-lg shadow-primary/30 transition-colors">
                Get Started Now
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Enterprise Custom</h3>
                  <p className="text-slate-500 text-xs mt-1">Tailored packages for state boards & universities.</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black tracking-tight text-slate-950">Custom</span>
                </div>
                <hr className="border-slate-200" />
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800">Unlimited assessments</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom LMS integrations (Canvas, Blackboard)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>White-label styling options</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated technical account manager</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited recording log retention</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => scrollToSection('contact')} className="w-full mt-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors">
                Contact Sales
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Get In Touch</h2>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Have questions? Let's connect.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Whether you're looking for an enterprise demo, pricing adjustments, custom LMS plugin queries, or technical setup support, we are here to help.
                </p>
              </div>

              <div className="space-y-4 text-slate-600 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>support@proctorediq.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>100 Pine Street, San Francisco, CA 94111</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/60 shadow-xl">
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Mock form submitted! We'll reply within 24 hours."); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@university.edu"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Organization / Institution Name</label>
                  <input
                    type="text"
                    required
                    placeholder="State University"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your test size and security requirements..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold tracking-tight">Proctored IQ</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Next-generation online examination hosting platform using edge intelligence to guarantee integrity, fairness, and detail logs.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing Plans</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it works</button></li>
                <li><a href="/login" className="hover:text-white transition-colors">Portal Login</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Audit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Support Contact</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FERPA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Data Processing</a></li>
              </ul>
            </div>

          </div>

          <hr className="border-slate-900 my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
            <span>&copy; {new Date().getFullYear()} Proctored IQ. All rights reserved.</span>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
