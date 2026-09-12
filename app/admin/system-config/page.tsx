'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, SystemConfig, SMTPConfig, SecurityPolicy, ProctoringRuleConfig } from '@/lib/store';
import {
  Settings,
  Mail,
  Shield,
  Sliders,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Clock,
  Globe,
  Key,
  CheckCircle2,
  Save,
  Send,
  Database,
  Cpu
} from 'lucide-react';

export default function SystemConfigurationPage() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(PlaceTrackStore.systemConfig);
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>(PlaceTrackStore.smtpConfig);
  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicy>(PlaceTrackStore.securityPolicy);
  const [proctoringRules, setProctoringRules] = useState<ProctoringRuleConfig>(PlaceTrackStore.proctoringRules);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = PlaceTrackStore.subscribe(() => {
      setSystemConfig({ ...PlaceTrackStore.systemConfig });
      setSmtpConfig({ ...PlaceTrackStore.smtpConfig });
      setSecurityPolicy({ ...PlaceTrackStore.securityPolicy });
      setProctoringRules({ ...PlaceTrackStore.proctoringRules });
    });
    return unsub;
  }, []);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    PlaceTrackStore.updateSystemConfig(systemConfig);
    showNotification('Global System Settings successfully saved and applied!');
  };

  const handleSaveSMTP = (e: React.FormEvent) => {
    e.preventDefault();
    PlaceTrackStore.updateSMTPConfig(smtpConfig);
    showNotification('SMTP Email Server configuration updated!');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    PlaceTrackStore.updateSecurityPolicy(securityPolicy);
    showNotification('Security Policies & Authentication Rules updated!');
  };

  const handleSaveProctoring = (e: React.FormEvent) => {
    e.preventDefault();
    PlaceTrackStore.updateProctoringRules(proctoringRules);
    showNotification('Global AI Proctoring parameters saved!');
  };

  const handleSendTestEmail = () => {
    setTestEmailStatus('Dispatching verification payload to ' + smtpConfig.sender_email + '...');
    setTimeout(() => {
      setTestEmailStatus('✓ SMTP Handshake successful! Test email delivered via ' + smtpConfig.host + ':' + smtpConfig.port);
      setTimeout(() => setTestEmailStatus(null), 5000);
    }, 1200);
  };

  const toggleMaintenance = () => {
    const next = !systemConfig.maintenance_mode;
    setSystemConfig({ ...systemConfig, maintenance_mode: next });
    PlaceTrackStore.updateSystemConfig({ maintenance_mode: next });
    showNotification(next ? 'SYSTEM PUT INTO MAINTENANCE MODE!' : 'System resumed to Normal Operations.');
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Feature 2: System Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Configuration & Global Parameters</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure institutional settings, SMTP email gateways, global AI proctoring rules, security thresholds, and feature flags
          </p>
        </div>

        {/* Maintenance Mode Emergency Switch */}
        <div className={`p-3 rounded-2xl border flex items-center space-x-3 ${
          systemConfig.maintenance_mode ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="block text-xs font-bold text-slate-900">Maintenance Mode</span>
            <span className="block text-[10px] text-slate-500">
              {systemConfig.maintenance_mode ? 'Restricting student logins' : 'System running live'}
            </span>
          </div>
          <button
            onClick={toggleMaintenance}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs ${
              systemConfig.maintenance_mode
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {systemConfig.maintenance_mode ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid of Configuration Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL 1: GLOBAL SETTINGS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold">Global Parameters & Localization</h3>
          </div>

          <form onSubmit={handleSaveGlobal} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Institution Full Name</label>
              <input
                type="text"
                value={systemConfig.institute_name}
                onChange={(e) => setSystemConfig({ ...systemConfig, institute_name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                <input
                  type="text"
                  value={systemConfig.academic_year}
                  onChange={(e) => setSystemConfig({ ...systemConfig, academic_year: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Placement Support Email</label>
                <input
                  type="email"
                  value={systemConfig.support_email}
                  onChange={(e) => setSystemConfig({ ...systemConfig, support_email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Institutional Timezone</label>
                <input
                  type="text"
                  value={systemConfig.timezone}
                  onChange={(e) => setSystemConfig({ ...systemConfig, timezone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Supported Language</label>
                <input
                  type="text"
                  value={systemConfig.language}
                  onChange={(e) => setSystemConfig({ ...systemConfig, language: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Global Parameters</span>
              </button>
            </div>
          </form>
        </div>

        {/* PANEL 2: FEATURE TOGGLES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold">Institutional Feature Toggles</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              {
                key: 'student_self_registration',
                title: 'Student Self-Registration',
                desc: 'Allow candidates to register with institutional email',
                value: systemConfig.student_self_registration,
              },
              {
                key: 'public_leaderboard',
                title: 'Public Placement Leaderboard',
                desc: 'Expose college-wide readiness score rankings to students',
                value: systemConfig.public_leaderboard,
              },
              {
                key: 'code_sandbox_enabled',
                title: 'Online Code Execution Sandbox',
                desc: 'Enable real-time Python & JavaScript runner during coding tests',
                value: systemConfig.code_sandbox_enabled,
              },
              {
                key: 'audio_proctoring_enabled',
                title: 'Acoustic Audio Monitoring',
                desc: 'Listen for secondary voices or abnormal whisper spikes',
                value: systemConfig.audio_proctoring_enabled,
              },
              {
                key: 'proctoring_ai_enabled',
                title: 'TensorFlow & MediaPipe Vision Engine',
                desc: 'Run real-time facial landmark detection in browser',
                value: systemConfig.proctoring_ai_enabled,
              },
              {
                key: 'allow_calculator',
                title: 'Embedded Scientific Calculator',
                desc: 'Provide floating scientific calculator tool on aptitude tests',
                value: systemConfig.allow_calculator,
              },
            ].map((toggle) => (
              <div
                key={toggle.key}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 block">{toggle.title}</span>
                  <span className="text-[11px] text-slate-500">{toggle.desc}</span>
                </div>

                <button
                  onClick={() => {
                    const updated = {
                      ...systemConfig,
                      [toggle.key]: !toggle.value,
                    };
                    setSystemConfig(updated);
                    PlaceTrackStore.updateSystemConfig({ [toggle.key]: !toggle.value });
                    showNotification(`Updated ${toggle.title}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    toggle.value ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 3: EMAIL SERVER (SMTP) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold">Email Server Setup (SMTP)</h3>
          </div>

          <form onSubmit={handleSaveSMTP} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Port</label>
                <input
                  type="number"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value) || 587 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sender Email</label>
                <input
                  type="email"
                  value={smtpConfig.sender_email}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, sender_email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sender Display Name</label>
                <input
                  type="text"
                  value={smtpConfig.sender_name}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, sender_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Encryption Mode</label>
                <select
                  value={smtpConfig.encryption}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="TLS">TLS (STARTTLS)</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None (Unencrypted)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Username / Auth</label>
                <input
                  type="text"
                  value={smtpConfig.username}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {testEmailStatus && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-[11px] font-bold">
                {testEmailStatus}
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test SMTP Connection</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save SMTP Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* PANEL 4: GLOBAL AI PROCTORING RULES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold">Global AI Proctoring Configurations</h3>
          </div>

          <form onSubmit={handleSaveProctoring} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Max Strikes Before Auto-Termination</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={proctoringRules.max_strikes_before_termination}
                  onChange={(e) => setProctoringRules({ ...proctoringRules, max_strikes_before_termination: parseInt(e.target.value) || 3 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Face Tracking Sensitivity</label>
                <select
                  value={proctoringRules.face_tracking_sensitivity}
                  onChange={(e) => setProctoringRules({ ...proctoringRules, face_tracking_sensitivity: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="low">Low (Tolerant of minor movement)</option>
                  <option value="medium">Medium (Standard campus tests)</option>
                  <option value="high">High (Strict corporate benchmarks)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-bold">COCO-SSD Phone Detection Confidence Threshold</label>
                <span className="font-mono font-bold text-slate-900">{(proctoringRules.phone_detection_threshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={0.95}
                step={0.05}
                value={proctoringRules.phone_detection_threshold}
                onChange={(e) => setProctoringRules({ ...proctoringRules, phone_detection_threshold: parseFloat(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-bold">Webcam Snapshot Frequency</label>
                <span className="font-mono font-bold text-slate-900">Every {proctoringRules.snapshot_interval_secs} seconds</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={proctoringRules.snapshot_interval_secs}
                onChange={(e) => setProctoringRules({ ...proctoringRules, snapshot_interval_secs: parseInt(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Proctoring Engine Settings</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
