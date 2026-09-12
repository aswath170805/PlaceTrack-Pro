'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, EmailTemplate, EmailLog } from '@/lib/store';
import {
  Mail,
  Send,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Smartphone,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Layers,
  Inbox
} from 'lucide-react';

type NotifyTab = 'compose' | 'templates' | 'logs' | 'push_pwa' | 'reminders';

export default function EmailAndNotificationManagementPage() {
  const [activeTab, setActiveTab] = useState<NotifyTab>('compose');
  const [templates, setTemplates] = useState<EmailTemplate[]>(PlaceTrackStore.emailTemplates);
  const [logs, setLogs] = useState<EmailLog[]>(PlaceTrackStore.emailLogs);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Bulk Email Compose Form
  const [composeForm, setComposeForm] = useState({
    targetAudience: 'all_students',
    department: 'all',
    subject: '',
    body: '',
  });
  const [isSending, setIsSending] = useState(false);

  // Edit/Add template modal
  const [showTemplateModal, setShowTemplateModal] = useState<EmailTemplate | null>(null);
  const [tplForm, setTplForm] = useState({ name: '', subject: '', body: '', trigger_event: '' });

  const syncState = () => {
    setTemplates([...PlaceTrackStore.emailTemplates]);
    setLogs([...PlaceTrackStore.emailLogs]);
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(() => {
      syncState();
    });
    return unsub;
  }, []);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSendBulkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.subject || !composeForm.body) return;

    setIsSending(true);
    setTimeout(() => {
      let recipientCount = 0;
      PlaceTrackStore.users.forEach((u) => {
        if (composeForm.targetAudience === 'all_students' && u.role !== 'student') return;
        if (composeForm.targetAudience === 'faculty' && u.role !== 'faculty') return;
        if (composeForm.department !== 'all' && u.department !== composeForm.department) return;

        PlaceTrackStore.emailLogs.unshift({
          id: 'el-' + Math.random().toString(36).substring(2, 8),
          recipient_email: u.email || `${u.full_name.toLowerCase().replace(/\s+/g, '.')}@svce.ac.in`,
          recipient_name: u.full_name,
          subject: composeForm.subject,
          status: 'sent',
          timestamp: new Date().toISOString(),
        });
        recipientCount++;
      });

      PlaceTrackStore.logAudit('BULK_EMAIL_DISPATCH', 'email_logs', undefined, {
        subject: composeForm.subject,
        recipients_count: recipientCount,
      });

      setIsSending(false);
      setComposeForm({ targetAudience: 'all_students', department: 'all', subject: '', body: '' });
      notify(`Broadcast dispatched successfully to ${recipientCount} recipients!`);
    }, 1200);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplForm.name || !tplForm.subject) return;

    if (showTemplateModal && showTemplateModal.id) {
      const idx = PlaceTrackStore.emailTemplates.findIndex(t => t.id === showTemplateModal.id);
      if (idx !== -1) {
        PlaceTrackStore.emailTemplates[idx] = {
          ...PlaceTrackStore.emailTemplates[idx],
          name: tplForm.name,
          subject: tplForm.subject,
          body: tplForm.body,
          trigger_event: tplForm.trigger_event,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      PlaceTrackStore.emailTemplates.push({
        id: 'et-' + Math.random().toString(36).substring(2, 8),
        name: tplForm.name,
        subject: tplForm.subject,
        body: tplForm.body,
        trigger_event: tplForm.trigger_event || 'custom_event',
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    }

    setShowTemplateModal(null);
    setTplForm({ name: '', subject: '', body: '', trigger_event: '' });
    notify('Email notification template saved!');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Feature 9: Email & Notification Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Communication & Dispatch Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated event triggers, bulk email broadcasts, SMTP queue logs, PWA web push notifications & reminder schedules
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: 'compose', label: 'Compose Bulk Email Broadcast', icon: Send },
          { id: 'templates', label: 'Email & In-App Templates', icon: Layers, count: templates.length },
          { id: 'logs', label: 'Sent Email Logs & Queue', icon: Inbox, count: logs.length },
          { id: 'reminders', label: 'Automated Reminders', icon: Clock },
          { id: 'push_pwa', label: 'PWA Web Push & SMS', icon: Smartphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NotifyTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPOSE BULK EMAIL */}
      {activeTab === 'compose' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-3xl space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Broadcast Campus Notification</h3>
            <p className="text-xs text-slate-500">Dispatch bulk email directly through the institutional SMTP server</p>
          </div>

          <form onSubmit={handleSendBulkEmail} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Group</label>
                <select
                  value={composeForm.targetAudience}
                  onChange={(e) => setComposeForm({ ...composeForm, targetAudience: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="all_students">All Students</option>
                  <option value="faculty">Faculty Members Only</option>
                  <option value="all">Everyone (Students + Faculty)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Filter by Department</label>
                <select
                  value={composeForm.department}
                  onChange={(e) => setComposeForm({ ...composeForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="all">All Departments</option>
                  {PlaceTrackStore.departments.map((d) => (
                    <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Header</label>
              <input
                type="text"
                placeholder="e.g. Important: Schedule for Google Placement Qualifier Test"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Message Content</label>
              <textarea
                rows={6}
                placeholder="Write message body here. Variables supported: {{full_name}}, {{department}}..."
                value={composeForm.body}
                onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Transmitting to SMTP Server...' : 'Dispatch Broadcast'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Configured Notification Templates ({templates.length})</h3>
            <button
              onClick={() => {
                setShowTemplateModal({} as any);
                setTplForm({ name: '', subject: '', body: '', trigger_event: '' });
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded uppercase">
                    {tpl.trigger_event}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{tpl.name}</h4>
                  <p className="text-[11px] text-slate-600 font-semibold mt-1">Subject: {tpl.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-3 mt-1 whitespace-pre-line">{tpl.body}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Updated: {new Date(tpl.updated_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      setShowTemplateModal(tpl);
                      setTplForm({ name: tpl.name, subject: tpl.subject, body: tpl.body, trigger_event: tpl.trigger_event });
                    }}
                    className="p-1 text-slate-500 hover:text-blue-600 rounded"
                    title="Edit Template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sent Email Logs & Delivery Status</h3>
              <p className="text-xs text-slate-500">Live delivery confirmations from college SMTP mail relay</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{logs.length} logged emails</span>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{log.recipient_name}</span>
                    <span className="text-[11px] text-slate-400">({log.recipient_email})</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Subject: {log.subject}</p>
                </div>

                <span className="text-xs text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">Automated Reminder Configurations</h3>
          <div className="space-y-3 text-xs">
            {[
              { title: '24-Hour Prior Test Notification', desc: 'Email candidates 24 hours before any scheduled qualifier starts', enabled: true },
              { title: '1-Hour Prior SMS & In-App Alert', desc: 'Push notification 60 minutes prior to camera verification opening', enabled: true },
              { title: 'Test Submission Confirmation', desc: 'Immediate score delivery email upon test completion', enabled: true },
              { title: 'Weekly Placement Streak Reminder', desc: 'Send daily practice reminder every Sunday evening at 6 PM', enabled: false },
            ].map((r, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">{r.title}</span>
                  <span className="text-[11px] text-slate-500">{r.desc}</span>
                </div>
                <input type="checkbox" defaultChecked={r.enabled} className="w-4 h-4 accent-indigo-600" />
              </div>
            ))}
          </div>
          <button
            onClick={() => notify('Reminder preferences updated!')}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
          >
            Save Reminder Schedule
          </button>
        </div>
      )}

      {/* TAB 5: PWA PUSH & SMS */}
      {activeTab === 'push_pwa' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">PWA Web Push Notifications & SMS Gateway</h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Web Push Protocol VAPID Keys</span>
            </div>
            <p className="font-mono text-[10px] break-all bg-white p-2 rounded border border-blue-200">
              Public Key: BKagx973041...f891aBC
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">SMS Provider Gateway</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="twilio">Twilio Cloud SMS API</option>
                <option value="msg91">MSG91 India Academic Route</option>
                <option value="disabled">Disabled (Email Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Sender ID (Alpha Header)</label>
              <input type="text" defaultValue="SVCEPL" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono" />
            </div>
          </div>

          <button
            onClick={() => notify('Push & SMS settings configured!')}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
          >
            Update Gateway Settings
          </button>
        </div>
      )}

      {/* MODAL: TEMPLATE EDIT */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              {showTemplateModal.id ? 'Edit Template' : 'Create Template'}
            </h3>
            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Template Name</label>
                <input
                  type="text"
                  value={tplForm.name}
                  onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Trigger Event</label>
                <input
                  type="text"
                  placeholder="e.g. test_scheduled or result_published"
                  value={tplForm.trigger_event}
                  onChange={(e) => setTplForm({ ...tplForm, trigger_event: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject Line</label>
                <input
                  type="text"
                  value={tplForm.subject}
                  onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Body Text</label>
                <textarea
                  rows={4}
                  value={tplForm.body}
                  onChange={(e) => setTplForm({ ...tplForm, body: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
