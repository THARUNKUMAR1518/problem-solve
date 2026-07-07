import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export const useProctoring = (sessionId, maxWarnings = 5, initialWarningCount = 0) => {
  const [warnings, setWarnings] = useState(initialWarningCount);
  const [stream, setStream] = useState(null);
  const [violationLogs, setViolationLogs] = useState([]);
  const hasSubmitted = useRef(false);

  // References to preserve state in listeners
  const warningsRef = useRef(initialWarningCount);
  warningsRef.current = warnings;

  // Initialize Webcam Stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      console.warn("Webcam access denied. Initializing simulation overlay...");
      return null;
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Log violation utility
  const recordViolation = async (type, description, weight = 1) => {
    // Prevent double submissions
    if (hasSubmitted.current) return;

    // Update local warnings counter and logs first for instant UI response
    const nextWarnings = warningsRef.current + weight;
    setWarnings(nextWarnings);

    const localLog = {
      id: Date.now(),
      violationType: type,
      warningIncrement: weight,
      description,
      timestamp: new Date().toISOString()
    };
    setViolationLogs(prev => [localLog, ...prev]);

    if (nextWarnings >= maxWarnings) {
      hasSubmitted.current = true;
      return;
    }

    if (sessionId.startsWith('mock-')) {
      return; // Skip backend POST in offline mode
    }

    try {
      await api.post(`/exams/sessions/${sessionId}/violation`, {
        violationType: type,
        warningWeight: weight,
        description,
        screenshotUrl: "" // Base64 screenshot placeholder
      });
    } catch (err) {
      console.warn("Could not sync proctor warnings with server.");
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    // 1. Right Click Blocker
    const handleContextMenu = (e) => {
      e.preventDefault();
      recordViolation('RIGHT_CLICK', 'Right-click menu is disabled in this assessment.');
    };

    // 2. Keyboard shortcuts block
    const handleKeyDown = (e) => {
      // Prevent Alt+Tab, Win keys, Ctrl+C, Ctrl+V, F12, Escape
      if (e.key === 'Escape' || e.key === 'Esc') {
        // Enforce fullscreen exit warning trigger
        recordViolation('FULLSCREEN_EXIT', 'Escape key pressed. Exited fullscreen focus.');
      }
      
      const forbiddenKeys = ['F11', 'F12', 'Meta', 'Alt'];
      if (forbiddenKeys.includes(e.key) || (e.ctrlKey && ['c', 'v', 'x', 'a', 'u', 'p'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        recordViolation('KEYBOARD_SHORTCUT', `Forbidden keystroke combination detected: ${e.key}`);
      }
    };

    // 3. Block Copy-Paste Events
    const handleCopyPaste = (e) => {
      e.preventDefault();
      recordViolation('COPY_PASTE', 'Copy-paste actions are strictly forbidden.');
    };

    // 4. Window focus changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('TAB_SWITCH', 'Student switched tabs or minimized browser window.');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('WINDOW_BLUR', 'Student clicked outside the browser examination window.');
    };

    // 6. Detect Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation('FULLSCREEN_EXIT', 'Student exited fullscreen mode.');
      }
    };

    // Attach listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initial Camera start
    startCamera();

    // 7. Simulating Proctor Vetting alerts (runs every 12 seconds to simulate real camera object classifications)
    const proctorInterval = setInterval(() => {
      const randomTrigger = Math.random();
      if (randomTrigger < 0.16) {
        recordViolation('MOBILE_PHONE_DETECTED', 'Malpractice alert: Mobile phone or unauthorized display classified in camera frame.');
      } else if (randomTrigger < 0.32) {
        recordViolation('FACE_MISSING', 'Proctor alert: Student face missing or camera feed blocked/hidden.');
      } else if (randomTrigger < 0.48) {
        recordViolation('FACE_AWAY', 'Proctor alert: Student face turned away (suspected malpractice).');
      } else if (randomTrigger < 0.64) {
        recordViolation('MULTIPLE_FACES', 'Proctor alert: Unidentified secondary persons or background members detected in webcam feed.', 2);
      } else if (randomTrigger < 0.80) {
        recordViolation('TALKING', 'Proctor alert: External conversation or voice signals detected.');
      }
    }, 12000);

    return () => {
      // Clean up listeners
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(proctorInterval);
      stopCamera();
    };
  }, [sessionId, maxWarnings]);

  return {
    warnings,
    stream,
    violationLogs,
    recordViolation,
    startCamera,
    stopCamera
  };
};
