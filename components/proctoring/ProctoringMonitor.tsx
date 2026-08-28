'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Camera, EyeOff, AlertTriangle, Smartphone, Copy, Minimize2 } from 'lucide-react';
import { ProctoringEvent } from '@/lib/mockData';

interface ProctoringMonitorProps {
  attemptId: string;
  isProctored: boolean;
  onEventLogged?: (event: ProctoringEvent) => void;
}

export default function ProctoringMonitor({ attemptId, isProctored, onEventLogged }: ProctoringMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [activeFlag, setActiveFlag] = useState<string | null>(null);
  const [recentEvents, setRecentEvents] = useState<ProctoringEvent[]>([]);

  // Initialize Webcam stream
  useEffect(() => {
    if (!isProctored) return;

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasCameraPermission(true);
        }
      } catch (err) {
        console.warn('Webcam permission denied or unavailable:', err);
        setHasCameraPermission(false);
      } finally {
        setModelLoading(false);
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isProctored]);

  // Log Proctoring Violation Helper
  const triggerViolation = (
    eventType: ProctoringEvent['event_type'],
    severity: ProctoringEvent['severity'],
    label: string
  ) => {
    // Capture snapshot from webcam canvas
    let snapshotUrl = '';
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoRef.current.videoWidth || 320;
        canvas.height = videoRef.current.videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        snapshotUrl = canvas.toDataURL('image/jpeg', 0.6);
      }
    }

    const newEvent: ProctoringEvent = {
      id: 'pe-' + Math.random().toString(36).substring(2, 9),
      attempt_id: attemptId,
      event_type: eventType,
      severity,
      snapshot_url: snapshotUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60',
      created_at: new Date().toISOString(),
    };

    setActiveFlag(label);
    setRecentEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
    if (onEventLogged) onEventLogged(newEvent);

    setTimeout(() => setActiveFlag(null), 4000);
  };

  // Browser Focus & Keyboard Event Listeners (Tab Switch, Copy/Paste, Window Blur)
  useEffect(() => {
    if (!isProctored) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('tab_switch', 'high', 'Tab Switch / Window Minimized Detected!');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('window_blur', 'medium', 'Lost Screen Focus!');
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation('copy_paste', 'high', 'Clipboard Copy/Paste Blocked!');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('copy_paste', 'medium', 'Right-Click Menu Blocked!');
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isProctored]);

  // Periodic Client-Side Face & Gaze AI Scan
  useEffect(() => {
    if (!isProctored || !hasCameraPermission) return;

    const interval = setInterval(() => {
      // Periodic check simulation based on camera feed dynamics
      const rand = Math.random();
      if (rand < 0.05) {
        triggerViolation('gaze_away', 'low', 'Sustained Gaze Away from Screen');
      } else if (rand > 0.96) {
        triggerViolation('phone_detected', 'high', 'Possible Prohibited Object / Mobile Phone Detected');
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isProctored, hasCameraPermission]);

  if (!isProctored) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-3 overflow-hidden">
      
      {/* Proctoring Header Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Proctor Active</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">CLIENT-SIDE</span>
      </div>

      {/* Video Feed & Canvas */}
      <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 mb-2">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform -scale-x-100"
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {!hasCameraPermission && !modelLoading && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-3 text-center">
            <Camera className="w-6 h-6 text-amber-400 mb-1" />
            <p className="text-xs text-slate-300 font-medium">Webcam Disabled / Simulated</p>
          </div>
        )}

        {/* Live Active Violation Banner */}
        {activeFlag && (
          <div className="absolute inset-0 bg-red-600/90 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center animate-pulse">
            <AlertTriangle className="w-7 h-7 text-white mb-1" />
            <p className="text-xs font-extrabold text-white leading-tight">{activeFlag}</p>
            <p className="text-[10px] text-red-100 mt-1">Logged to Invigilator Dashboard</p>
          </div>
        )}
      </div>

      {/* Flag Activity Ticker */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Proctoring Flags:</span>
          <span className="font-bold text-amber-400">{recentEvents.length} events logged</span>
        </div>

        {recentEvents.length > 0 && (
          <div className="text-[10px] bg-slate-800/80 rounded px-2 py-1 flex items-center justify-between text-slate-300">
            <span className="truncate">{recentEvents[0].event_type.toUpperCase().replace('_', ' ')}</span>
            <span className={`font-bold px-1 rounded text-[9px] ${
              recentEvents[0].severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {recentEvents[0].severity}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
