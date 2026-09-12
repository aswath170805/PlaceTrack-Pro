'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, ApiKey, WebhookConfig } from '@/lib/store';
import {
  Cpu,
  Key,
  Webhook,
  Globe,
  Calendar,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

type IntegrationsTab = 'api_keys' | 'webhooks' | 'sso' | 'lms' | 'calendar';

export default function IntegrationManagementPage() {
  const [activeTab, setActiveTab] = useState<IntegrationsTab>('api_keys');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(PlaceTrackStore.apiKeys);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(PlaceTrackStore.webhooks);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New API Key Modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyPerm, setKeyPerm] = useState<'read' | 'write' | 'admin'>('read');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // New Webhook Modal
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [whName, setWhName] = useState('');
  const [whUrl, setWhUrl] = useState('');

  const syncState = () => {
    setApiKeys([...PlaceTrackStore.apiKeys]);
    setWebhooks([...PlaceTrackStore.webhooks]);
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(syncState);
    return unsub;
  }, []);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    const rawSecret = 'pt_live_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey: ApiKey = {
      id: 'ak-' + Math.random().toString(36).substring(2, 8),
      name: keyName.trim(),
      key_prefix: rawSecret.slice(0, 12),
      key_hash: '••••••••••••••••••••••••' + rawSecret.slice(-4),
      permissions: keyPerm,
      created_at: new Date().toISOString(),
      is_active: true,
    };
    PlaceTrackStore.apiKeys.unshift(newKey);
    PlaceTrackStore.logAudit('CREATE_API_KEY', 'api_keys', newKey.id, { name: newKey.name, permissions: keyPerm });
    setGeneratedKey(rawSecret);
  };

  const handleRevokeApiKey = (id: string, name: string) => {
    if (confirm(`Revoke API key "${name}"? Integrated systems using this key will immediately lose access.`)) {
      const idx = PlaceTrackStore.apiKeys.findIndex(k => k.id === id);
      if (idx !== -1) PlaceTrackStore.apiKeys.splice(idx, 1);
      PlaceTrackStore.logAudit('REVOKE_API_KEY', 'api_keys', id, { name });
      notify(`API key "${name}" revoked.`);
    }
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName || !whUrl) return;
    const newWh: WebhookConfig = {
      id: 'wh-' + Math.random().toString(36).substring(2, 8),
      name: whName,
      target_url: whUrl,
      events: ['test.submitted', 'attempt.terminated'],
      is_active: true,
      secret: 'whsec_' + Math.random().toString(36).substring(2, 12),
      last_triggered: 'Never',
    };
    PlaceTrackStore.webhooks.unshift(newWh);
    PlaceTrackStore.logAudit('CREATE_WEBHOOK', 'webhooks', newWh.id, { name: whName, url: whUrl });
    setShowWebhookModal(false);
    setWhName('');
    setWhUrl('');
    notify(`Webhook "${whName}" registered!`);
  };

  const handleTestWebhook = (wh: WebhookConfig) => {
    notify(`Test ping dispatched to ${wh.target_url}: HTTP 200 OK.`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Feature 13: Integration Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">API Key Management, Webhooks & Enterprise SSO</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect PlaceTrack Pro with college ERP, Moodle LMS, Azure Active Directory, Google Workspace & Webhooks
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
          { id: 'api_keys', label: 'REST API Keys', icon: Key, count: apiKeys.length },
          { id: 'webhooks', label: 'Outgoing Webhooks', icon: Webhook, count: webhooks.length },
          { id: 'sso', label: 'Single Sign-On (SSO)', icon: Globe },
          { id: 'lms', label: 'LMS Connectors (Moodle/Canvas)', icon: ShieldCheck },
          { id: 'calendar', label: 'Calendar Sync (iCal)', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as IntegrationsTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: API KEYS */}
      {activeTab === 'api_keys' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institutional REST API Credentials ({apiKeys.length})</h3>
              <p className="text-xs text-slate-500">Bearer tokens for automated ERP synchronization and programmatic score export</p>
            </div>
            <button
              onClick={() => {
                setShowKeyModal(true);
                setGeneratedKey(null);
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Generate API Key</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{key.name}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                      key.permissions === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {key.permissions} Scope
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-500 mt-1">{key.key_prefix}••••••••</p>
                  <span className="text-[10px] text-slate-400">Created: {new Date(key.created_at).toLocaleDateString()} • Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleTimeString() : 'Never'}</span>
                </div>

                <button
                  onClick={() => handleRevokeApiKey(key.id, key.name)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Key</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOKS */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configured Webhook Endpoints ({webhooks.length})</h3>
              <p className="text-xs text-slate-500">HTTP POST notifications dispatched in real-time on assessment events</p>
            </div>
            <button
              onClick={() => setShowWebhookModal(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Webhook</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {webhooks.map((wh) => (
              <div key={wh.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{wh.name}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="font-mono text-xs text-blue-600 mt-0.5">{wh.target_url}</p>
                  <p className="text-[11px] text-slate-400">Events: {wh.events.join(', ')} • Secret: <code className="font-mono">{wh.secret}</code></p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTestWebhook(wh)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ping Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SSO CONFIGURATION */}
      {activeTab === 'sso' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">Institutional Single Sign-On (SSO) Setup</h3>
          <p className="text-xs text-slate-500">Authenticate students and faculty via Google Workspace (Google OAuth) or Microsoft Azure AD</p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Identity Provider Protocol</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="google">Google Workspace (@svce.ac.in OAuth 2.0)</option>
                <option value="azure">Microsoft Entra ID / Azure AD (SAML 2.0)</option>
                <option value="disabled">Username / Password Only</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Client ID</label>
              <input type="text" defaultValue="9840219481-svce.apps.googleusercontent.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Allowed Email Domain Restriction</label>
              <input type="text" defaultValue="@svce.ac.in" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-700 font-bold" />
            </div>
          </div>

          <button
            onClick={() => notify('SSO authentication configuration saved!')}
            className="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Save SSO Configuration
          </button>
        </div>
      )}

      {/* TAB 4: LMS INTEGRATION */}
      {activeTab === 'lms' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">Learning Management System (LMS) Grade Sync</h3>
          <p className="text-xs text-slate-500">Synchronize assessment completion and scores back to college Moodle or Canvas courses</p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">LMS Platform</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="moodle">Moodle LTI 1.3 Advantage</option>
                <option value="canvas">Instructure Canvas LMS REST</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">College Moodle URL</label>
              <input type="text" defaultValue="https://lms.svce.ac.in" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Moodle WebService Token</label>
              <input type="password" defaultValue="••••••••••••••••••••••••••••••••" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
            </div>
          </div>

          <button
            onClick={() => notify('LMS integration handshake successful!')}
            className="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Save LMS Connector
          </button>
        </div>
      )}

      {/* TAB 5: CALENDAR SYNC */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-900">iCalendar Feed & Schedule Subscriptions</h3>
          <p className="text-xs text-slate-500">Subscribe college placement test schedules into Google Calendar or Outlook</p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">Public iCal Feed URL</span>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value="https://placetrack.svce.ac.in/api/calendar/feed.ics"
                className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://placetrack.svce.ac.in/api/calendar/feed.ics');
                  notify('iCal feed URL copied to clipboard!');
                }}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE API KEY */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Provision REST API Key</h3>
            {!generatedKey ? (
              <form onSubmit={handleCreateApiKey} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Key Description / Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Placement Cell Tableau BI Pipeline"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Permission Scope</label>
                  <select
                    value={keyPerm}
                    onChange={(e) => setKeyPerm(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="read">Read Only (Scores & Student Lists)</option>
                    <option value="write">Read & Write (Submit Tests & Update Profiles)</option>
                    <option value="admin">Full Admin Access</option>
                  </select>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl"
                  >
                    Generate Secret
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 font-bold">
                  ✓ API Secret Key Generated! Copy it now; it will not be displayed again.
                </div>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl break-all">
                  {generatedKey}
                </div>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl"
                >
                  I Have Stored This Key Safely
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: NEW WEBHOOK */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Register Webhook Endpoint</h3>
            <form onSubmit={handleCreateWebhook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Webhook Name</label>
                <input
                  type="text"
                  placeholder="e.g. Student ERP Ingestion"
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payload Target URL (HTTPS)</label>
                <input
                  type="url"
                  placeholder="https://erp.svce.ac.in/webhooks/placement"
                  value={whUrl}
                  onChange={(e) => setWhUrl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl"
                >
                  Register Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
