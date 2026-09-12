'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldAlert, AlertTriangle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PROCTORING_CONFIG } from './proctoringConfig';
import { ViolationManager, ViolationRecord } from './ViolationManager';
import { FaceMonitor } from './FaceMonitor';
import { GazeMonitor } from './GazeMonitor';
import { ObjectDetector } from './ObjectDetector';
import { AudioMonitor } from './AudioMonitor';
import { BrowserMonitor } from './BrowserMonitor';
import { SoftwareCameraResistanceProvider } from './DisplayProtectionProvider';
import AntiCameraWatermark from './AntiCameraWatermark';
import DynamicScreenPattern from './DynamicScreenPattern';

interface ProctoringMonitorProps {
  attemptId: string;
  isProctored: boolean;
  studentName?: string;
  testTitle?: string;
  onViolationOccurred?: (record: ViolationRecord, totalCount: number) => void;
  onAutoTerminateTriggered?: (records: ViolationRecord[], count: number) => void;
  onPermissionDenied?: (reason: string) => void;
}

export default function ProctoringMonitor({
  attemptId,
  isProctored,
  studentName,
  testTitle,
  onViolationOccurred,
  onAutoTerminateTriggered,
  onPermissionDenied
}: ProctoringMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [warningsCount, setWarningsCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; isPhone?: boolean } | null>(null);

  // Monitor & Provider instances initialized via refs
  const violationManagerRef = useRef<ViolationManager | null>(null);
  const faceMonitorRef = useRef<FaceMonitor | null>(null);
  const gazeMonitorRef = useRef<GazeMonitor | null>(null);
  const objectDetectorRef = useRef<ObjectDetector | null>(null);
  const audioMonitorRef = useRef<AudioMonitor | null>(null);
  const browserMonitorRef = useRef<BrowserMonitor | null>(null);
  const cameraResistanceRef = useRef<SoftwareCameraResistanceProvider | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isProctored) return;

    // Instantiate Software Camera Resistance Protection Provider
    const protectionProvider = new SoftwareCameraResistanceProvider();
    protectionProvider.enable({
      studentDisplayId: studentName ? `STU-${studentName.replace(/\s+/g, '').substring(0, 6).toUpperCase()}` : 'STU-8924',
      sessionIdentifier: attemptId ? attemptId.substring(0, 8).toUpperCase() : 'SESS-9041',
      assessmentTitle: testTitle || 'Proctored Assessment',
      enableDynamicWatermark: false,
      enableDynamicPattern: true,
      enableScreenshotDeterrence: true,
    });
    cameraResistanceRef.current = protectionProvider;

    // Instantiate ViolationManager
    const vManager = new ViolationManager(
      attemptId,
      studentName,
      testTitle,
      (record, count) => {
        setWarningsCount(count);

        if (record.violationType === 'phone_detected') {
          setActiveToast({
            title: '⚠ Mobile Phone Detected',
            message: 'Please remove the mobile phone from the assessment area immediately.',
            isPhone: true,
          });
        } else {
          setActiveToast({
            title: '⚠ Proctoring Warning',
            message: record.details || 'Suspicious activity logged by AI proctoring engine.',
            isPhone: false,
          });
        }

        setTimeout(() => setActiveToast(null), 5500);

        if (onViolationOccurred) onViolationOccurred(record, count);
      },
      (records, count) => {
        setWarningsCount(count);
        if (onAutoTerminateTriggered) onAutoTerminateTriggered(records, count);
      }
    );
    violationManagerRef.current = vManager;

    // Instantiate individual monitors
    faceMonitorRef.current = new FaceMonitor(vManager);
    gazeMonitorRef.current = new GazeMonitor(vManager);
    objectDetectorRef.current = new ObjectDetector(vManager);
    audioMonitorRef.current = new AudioMonitor(vManager);
    browserMonitorRef.current = new BrowserMonitor(vManager);

    // Initialize media streams & AI models
    async function setupProctoringPipeline() {
      setIsModelsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user', frameRate: { ideal: 15 } },
          audio: true,
        });

        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setHasPermissions(true);

        // Start Browser Monitoring & Content Deterrence
        browserMonitorRef.current?.start();

        // Start Audio Monitoring
        await audioMonitorRef.current?.start(stream);

        // Pre-load & Start Face & COCO-SSD Phone Detection Models
        await faceMonitorRef.current?.initialize();
        await objectDetectorRef.current?.initialize();

        if (videoRef.current) {
          faceMonitorRef.current?.start(videoRef.current, canvasRef.current || undefined);
          objectDetectorRef.current?.start(videoRef.current, canvasRef.current || undefined);
        }

        setIsModelsLoading(false);
      } catch (err: any) {
        console.warn('Proctoring camera/mic permission or loading error:', err);
        const errMsg = 'Camera and Microphone access are required for this proctored assessment.';
        setPermissionError(errMsg);
        setHasPermissions(false);
        setIsModelsLoading(false);
        if (onPermissionDenied) onPermissionDenied(errMsg);
      }
    }

    setupProctoringPipeline();

    // Cleanup all media tracks and monitoring loops on unmount
    return () => {
      stopAllMonitors();
    };
  }, [attemptId, isProctored]);

  const stopAllMonitors = () => {
    browserMonitorRef.current?.stop();
    faceMonitorRef.current?.stop();
    objectDetectorRef.current?.stop();
    audioMonitorRef.current?.stop();
    cameraResistanceRef.current?.disable();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (!isProctored) return null;

  return (
    <>
      {/* Dynamic High-Frequency Screen Security Pattern Overlay */}
      <DynamicScreenPattern isActive={isProctored} />

      {/* 3. Small Non-Intrusive Proctoring Indicator Card */}
      <div className="fixed bottom-4 right-4 z-50 w-72 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-3.5 font-sans selection:bg-indigo-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              Proctoring Active
            </span>
          </div>

          <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
            warningsCount >= 2 ? 'bg-red-900 text-red-200 animate-pulse' : warningsCount >= 1 ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-300'
          }`}>
            Warnings: {warningsCount}/{PROCTORING_CONFIG.MAX_ALLOWED_VIOLATIONS}
          </div>
        </div>

        {/* Security Feature Checklist Pills */}
        <div className="grid grid-cols-2 gap-1 mb-2 text-[10px] font-semibold text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Camera ✓</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Microphone ✓</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>AI Monitoring ✓</span>
          </div>
          <div className="flex items-center space-x-1 text-indigo-400">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Camera Protection ✓</span>
          </div>
        </div>

        {/* Live Video Feed Preview */}
        <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
          <video
            ref={videoRef}
            className="w-full h-full object-cover transform -scale-x-100"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {isModelsLoading && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-2 text-center space-y-1">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <p className="text-[10px] text-slate-300 font-medium">Initializing AI Security Engine...</p>
            </div>
          )}

          {!hasPermissions && !isModelsLoading && (
            <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-3 text-center">
              <Camera className="w-6 h-6 text-red-400 mb-1" />
              <p className="text-[11px] text-red-300 font-bold leading-tight">Access Required</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Camera / Mic permission denied</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Phone Detection Warning Toast Notification */}
      {activeToast && (
        <div className={`fixed top-20 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start space-x-3 animate-in fade-in slide-in-from-top-3 border ${
          activeToast.isPhone
            ? 'bg-red-950/95 text-red-100 border-red-500/60'
            : 'bg-amber-950/95 text-amber-100 border-amber-500/50'
        }`}>
          <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 animate-bounce ${
            activeToast.isPhone ? 'text-red-400' : 'text-amber-400'
          }`} />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black uppercase tracking-wider">{activeToast.title}</h4>
            <p className="text-xs leading-snug font-medium opacity-90">{activeToast.message}</p>
            <p className="text-[10px] font-extrabold pt-1">
              Warning: {warningsCount}/{PROCTORING_CONFIG.MAX_ALLOWED_VIOLATIONS}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
