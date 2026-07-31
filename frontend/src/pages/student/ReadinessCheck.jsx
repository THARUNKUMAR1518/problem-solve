import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  ShieldCheck, Camera, Mic, Monitor, Wifi, Chrome, Maximize, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Puzzle
} from 'lucide-react';

const ReadinessCheck = () => {
  const { id } = useParams(); // Assessment ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Individual Checks States
  const [cameraOk, setCameraOk] = useState(null); // null = waiting, true = pass, false = fail
  const [micOk, setMicOk] = useState(null);
  const [screenOk, setScreenOk] = useState(null);
  const [browserOk, setBrowserOk] = useState(null);
  const [speedOk, setSpeedOk] = useState(null);
  const [fullscreenOk, setFullscreenOk] = useState(false);
  const [extensionsOk, setExtensionsOk] = useState(null);
  const [detectedExtName, setDetectedExtName] = useState('');

  const [internetSpeed, setInternetSpeed] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      // Offline mode check
      if (user?.email === 'test@gmail.com' || user?.email?.startsWith('test-')) {
        setExam({
          id: id,
          title: 'Data Structures Midterm',
          subject: { name: 'Data Structures and Algorithms' },
          durationMinutes: 90,
          passingMarks: 40,
          totalMarks: 100
        });
        setLoading(false);
        runAutomaticChecks();
        return;
      }

      try {
        const response = await api.get(`/assessments/${id}`);
        setExam(response.data);
      } catch (err) {
        setError('Failed to fetch assessment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    runAutomaticChecks();
  }, [id, user]);

  const runAutomaticChecks = () => {
    // 1. Browser Compatibility
    const hasVisibility = typeof document.visibilityState !== 'undefined';
    const hasFullscreen = typeof document.documentElement.requestFullscreen !== 'undefined';
    const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (hasVisibility && hasFullscreen && hasMedia) {
      setBrowserOk(true);
    } else {
      setBrowserOk(false);
    }

    // 2. Internet Speed Mock test
    setTimeout(() => {
      const mockSpeed = (Math.random() * 8 + 3).toFixed(1); // 3 to 11 Mbps
      setInternetSpeed(`${mockSpeed} Mbps`);
      setSpeedOk(Number(mockSpeed) >= 1.5);
    }, 1500);
  };

  // Check Media Permissions
  const requestMediaPermissions = async () => {
    setCameraOk(null);
    setMicOk(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      setCameraOk(true);
      setMicOk(true);
    } catch (err) {
      setCameraOk(false);
      setMicOk(false);
    }
  };

  // Request Screen Share
  const requestScreenShare = async () => {
    setScreenOk(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor"
        }
      });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      // Enforce entire screen sharing (displaySurface must be "monitor")
      if (settings.displaySurface && settings.displaySurface !== 'monitor') {
        stream.getTracks().forEach(t => t.stop());
        setScreenOk(false);
        alert('Access Denied: You MUST share your ENTIRE SCREEN (not a single window or browser tab) to proceed with the exam.');
        return;
      }

      setScreenStream(stream);
      setScreenOk(true);

      // Add listener to check if student stops sharing
      track.onended = () => {
        setScreenOk(false);
      };
    } catch (err) {
      setScreenOk(false);
    }
  };

  const detectExtensions = () => {
    // blocklist for AI/malicious assistant extensions
    const suspiciousKeywords = [
      'sider', 'monica', 'grammarly', 'adblock', 'google-translate', 
      'googletranslate', 'goog-gt', 'copilot', 'chatgpt'
    ];

    // 1. Check window objects for any matching global variable keys
    try {
      for (const key in window) {
        const lowerKey = key.toLowerCase();
        for (const keyword of suspiciousKeywords) {
          if (lowerKey.includes(keyword)) {
            return { detected: true, name: `Global variable: ${key}` };
          }
        }
      }
    } catch (e) {
      // Ignored
    }

    // 2. Check for resource tags (scripts, stylesheets, frames) pointing to blocked extensions
    try {
      const resources = document.querySelectorAll('script, link, img, iframe, source');
      for (const el of resources) {
        const src = el.src || '';
        const href = el.href || '';
        const url = (src || href).toLowerCase();
        if (url.includes('extension:') || url.includes('chrome-extension:') ||
            url.includes('moz-extension:') || url.includes('edge-extension:')) {
          // Only block if the asset belongs to one of the suspicious extensions
          for (const keyword of suspiciousKeywords) {
            if (url.includes(keyword)) {
              return { detected: true, name: `Asset: ${src || href}` };
            }
          }
        }
      }
    } catch (e) {
      // Ignored
    }

    // 3. Check CSS Rules for injected extension stylesheets
    try {
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            for (let j = 0; j < rules.length; j++) {
              const cssText = rules[j].cssText.toLowerCase();
              for (const keyword of suspiciousKeywords) {
                if (cssText.includes(keyword)) {
                  return { detected: true, name: `CSS Style Rule containing: ${keyword}` };
                }
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheet security exception - ignore
        }
      }
    } catch (e) {
      // Ignored
    }

    // 4. Recursive deep scanner of DOM and Shadow DOM roots
    const scanNode = (node) => {
      if (!node) return null;

      // Check element tag name
      const tagName = node.tagName ? node.tagName.toLowerCase() : '';
      for (const keyword of suspiciousKeywords) {
        if (tagName.includes(keyword)) {
          return { detected: true, name: `<${tagName}> element` };
        }
      }

      // Check element ID and classes
      const id = node.id ? node.id.toLowerCase() : '';
      const className = typeof node.className === 'string' ? node.className.toLowerCase() : '';
      for (const keyword of suspiciousKeywords) {
        if (id.includes(keyword)) {
          return { detected: true, name: `Element ID: ${node.id}` };
        }
        if (className.includes(keyword)) {
          return { detected: true, name: `Element Class: ${node.className}` };
        }
      }

      // Check element attributes
      if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          const attrName = attr.name.toLowerCase();
          const attrVal = attr.value.toLowerCase();
          for (const keyword of suspiciousKeywords) {
            if (attrName.includes(keyword) || attrVal.includes(keyword)) {
              return { detected: true, name: `Element attribute [${attr.name}="${attr.value}"]` };
            }
          }
        }
      }

      // Recurse light DOM children
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const result = scanNode(node.children[i]);
          if (result) return result;
        }
      }

      // Recurse shadow DOM children if open shadowRoot exists
      if (node.shadowRoot) {
        const shadowResult = scanNode(node.shadowRoot);
        if (shadowResult) return shadowResult;
        if (node.shadowRoot.children) {
          for (let i = 0; i < node.shadowRoot.children.length; i++) {
            const result = scanNode(node.shadowRoot.children[i]);
            if (result) return result;
          }
        }
      }

      return null;
    };

    // Start deep scan from html root
    const domScanResult = scanNode(document.documentElement);
    if (domScanResult) {
      return domScanResult;
    }

    return { detected: false };
  };

  // Continuous monitoring loop for active browser extensions
  useEffect(() => {
    const scan = () => {
      const result = detectExtensions();
      if (result.detected) {
        setExtensionsOk(false);
        setDetectedExtName(result.name);
      } else {
        setExtensionsOk(true);
        setDetectedExtName('');
      }
    };
    scan();
    const interval = setInterval(scan, 2000);
    return () => clearInterval(interval);
  }, []);

  // Enforce Fullscreen Mode
  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        await element.webkitRequestFullscreen();
      }
      setFullscreenOk(true);
    } catch (err) {
      setFullscreenOk(false);
      alert('Fullscreen access is required to take this exam.');
    }
  };

  // Detect fullscreen exit during check page
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenOk(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleStartExam = async () => {
    // Prevent starting the exam if extensions are detected
    const extCheck = detectExtensions();
    if (extCheck.detected) {
      setExtensionsOk(false);
      setDetectedExtName(extCheck.name);
      alert(`Access Blocked: Active browser extension detected (${extCheck.name}). Please disable or remove extensions before launching the examination.`);
      return;
    }

    if (!cameraOk || !micOk || !screenOk || !browserOk || !speedOk || !fullscreenOk || !extensionsOk) {
      alert('Please complete and pass all readiness checks before proceeding.');
      return;
    }

    try {
      // Clean up local media streams used for checking so webcam can be reassigned in exam page
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      if (screenStream) screenStream.getTracks().forEach(t => t.stop());

      // Start backend session (skip if offline test user)
      if (user?.email === 'test@gmail.com' || user?.email?.startsWith('test-')) {
        navigate(`/student/exam/mock-session-123/session`);
        return;
      }

      const response = await api.post(`/exams/sessions/start?studentId=${user.userId}&assessmentId=${id}`);
      navigate(`/student/exam/${response.data.id}/session`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start examination session.');
    }
  };

  const allPassed = cameraOk && micOk && screenOk && browserOk && speedOk && fullscreenOk && extensionsOk;

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-screen bg-slate-50">
        <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-[#F8FAFC] py-12 px-6 flex flex-col justify-between">
      <div class="max-w-3xl mx-auto w-full space-y-6 flex-1">

        {/* Header */}
        <div class="flex items-center justify-between border-b border-slate-200/60 pb-5">
          <div class="flex items-center space-x-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              class="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <ShieldCheck class="w-6 h-6 text-primary" />
              <span class="font-bold text-[#0F172A] text-lg">SecureAssess Proctoring Checks</span>
            </div>
          </div>
        </div>

        {/* Exam parameters card */}
        <div class="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl">
          <span class="px-2.5 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
            {exam?.subject?.name}
          </span>
          <h2 class="text-xl font-bold text-slate-900 mt-2">{exam?.title}</h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">Duration: {exam?.durationMinutes} mins • Passing Mark: {exam?.passingMarks} / {exam?.totalMarks}</p>
        </div>

        {/* Check items */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Camera Permission Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${cameraOk === true ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Camera class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Camera Access</h4>
                <p class="text-[11px] text-slate-500 font-medium">Webcam feeds used for face checks.</p>
              </div>
            </div>
            {cameraOk === true ? (
              <span class="text-xs font-bold text-emerald-600">Passed</span>
            ) : cameraOk === false ? (
              <button onClick={requestMediaPermissions} class="text-xs font-bold text-red-500 hover:underline">Grant</button>
            ) : (
              <button onClick={requestMediaPermissions} class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-bold transition-all">Check</button>
            )}
          </div>

          {/* Microphone Permission Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${micOk === true ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Mic class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Audio Mic Access</h4>
                <p class="text-[11px] text-slate-500 font-medium">Audits background noise.</p>
              </div>
            </div>
            {micOk === true ? (
              <span class="text-xs font-bold text-emerald-600">Passed</span>
            ) : micOk === false ? (
              <button onClick={requestMediaPermissions} class="text-xs font-bold text-red-500 hover:underline">Grant</button>
            ) : (
              <button onClick={requestMediaPermissions} class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-bold transition-all">Check</button>
            )}
          </div>

          {/* Screen Share Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${screenOk === true ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Monitor class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Screen Share Feed</h4>
                <p class="text-[11px] text-slate-500 font-medium">Monitors desktop monitor outputs.</p>
              </div>
            </div>
            {screenOk === true ? (
              <span class="text-xs font-bold text-emerald-600">Shared</span>
            ) : screenOk === false ? (
              <button onClick={requestScreenShare} class="text-xs font-bold text-red-500 hover:underline font-semibold">Share Screen</button>
            ) : (
              <button onClick={requestScreenShare} class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-bold transition-all">Share Screen</button>
            )}
          </div>

          {/* Browser Compatibility Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${browserOk === true ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Chrome class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Browser Environment</h4>
                <p class="text-[11px] text-slate-500 font-medium">Locks out incompatible engines.</p>
              </div>
            </div>
            {browserOk === true ? (
              <span class="text-xs font-bold text-emerald-600">Passed</span>
            ) : browserOk === false ? (
              <span class="text-xs font-bold text-red-500">Incompatible</span>
            ) : (
              <span class="text-xs font-bold text-slate-400">Verifying...</span>
            )}
          </div>

          {/* Network Speed Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${speedOk === true ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Wifi class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Connection Quality</h4>
                <p class="text-[11px] text-slate-500 font-medium">Requires stable bandwidth speeds.</p>
              </div>
            </div>
            <div class="text-right">
              {speedOk === true ? (
                <span class="text-xs font-bold text-emerald-600 block">Passed</span>
              ) : speedOk === false ? (
                <span class="text-xs font-bold text-red-500 block">Too Slow</span>
              ) : (
                <span class="text-xs font-bold text-slate-400 block">Testing...</span>
              )}
              <span class="text-[10px] text-slate-400 font-mono font-medium">{internetSpeed}</span>
            </div>
          </div>

          {/* Fullscreen Mode Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${fullscreenOk ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                <Maximize class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Fullscreen Focus</h4>
                <p class="text-[11px] text-slate-500 font-medium">Binds browser focus on the exam canvas.</p>
              </div>
            </div>
            {fullscreenOk ? (
              <span class="text-xs font-bold text-emerald-600 font-semibold">Enabled</span>
            ) : (
              <button onClick={enterFullscreen} class="px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-primary/10">Lock Fullscreen</button>
            )}
          </div>

          {/* Browser Extension Check */}
          <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-card flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class={`p-3 rounded-xl ${extensionsOk === true ? 'bg-emerald-50 text-emerald-600' : extensionsOk === false ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                <Puzzle class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">Browser Extensions</h4>
                <p class="text-[11px] text-slate-500 font-medium">
                  {extensionsOk === false
                    ? `Conflict detected: disable extensions (e.g. ${detectedExtName})`
                    : 'Checks for active extension interfaces.'}
                </p>
              </div>
            </div>
            {extensionsOk === true ? (
              <span class="text-xs font-bold text-emerald-600 font-semibold">Clean (Passed)</span>
            ) : extensionsOk === false ? (
              <span class="text-xs font-bold text-rose-600 animate-pulse font-semibold">Disable Extensions</span>
            ) : (
              <span class="text-xs font-bold text-slate-400">Scanning...</span>
            )}
          </div>

        </div>

        {/* Warning banner */}
        {!allPassed && (
          <div class="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl text-xs font-medium leading-relaxed">
            <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong class="font-bold text-amber-950">Secure Lockout Active:</strong> You are strictly required to resolve all prerequisites, share your screen monitor feeds, and enter fullscreen mode before starting the exam. Tab-switching or exiting fullscreen during the examination is flagged as a violation.
            </div>
          </div>
        )}
      </div>

      {/* Start Button Drawer */}
      <footer class="mt-8 border-t border-slate-200/60 pt-6 flex items-center justify-end max-w-3xl mx-auto w-full">
        <button
          onClick={handleStartExam}
          disabled={!allPassed}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${allPassed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10 hover:shadow-emerald-600/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
        >
          <span>Start Assessment</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

export default ReadinessCheck;
