'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, SupportTicket, BugReport, FAQItem } from '@/lib/store';
import {
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  Bug,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Edit,
  FileText
} from 'lucide-react';

type SupportTab = 'tickets' | 'faqs' | 'bugs' | 'feedback';

export default function SupportAndHelpManagementPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>(PlaceTrackStore.supportTickets);
  const [faqs, setFaqs] = useState<FAQItem[]>(PlaceTrackStore.faqs);
  const [bugReports, setBugReports] = useState<BugReport[]>(PlaceTrackStore.bugReports);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const syncState = () => {
    setTickets([...PlaceTrackStore.supportTickets]);
    setFaqs([...PlaceTrackStore.faqs]);
    setBugReports([...PlaceTrackStore.bugReports]);
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

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    PlaceTrackStore.replyToTicket(selectedTicket.id, replyMessage.trim(), 'Placement Admin', true);
    setReplyMessage('');
    notify('Reply dispatched to student!');
  };

  const handleUpdateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    PlaceTrackStore.updateTicketStatus(ticketId, status);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }
    notify(`Ticket status marked as ${status.toUpperCase()}!`);
  };

  const handleResolveBug = (bugId: string) => {
    const bug = PlaceTrackStore.bugReports.find(b => b.id === bugId);
    if (bug) {
      bug.status = 'fixed';
      notify(`Bug report #${bugId} marked as FIXED.`);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Feature 14: Support & Help Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Help Desk, Candidate Inquiries & Bug Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve student assessment tickets, publish FAQ articles, review candidate feedback & triage technical bug reports
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
          { id: 'tickets', label: 'Support Ticket Inbox', icon: MessageSquare, count: tickets.filter(t => t.status !== 'resolved').length },
          { id: 'faqs', label: 'FAQ Knowledgebase', icon: HelpCircle, count: faqs.length },
          { id: 'bugs', label: 'Bug Reports & Triage', icon: Bug, count: bugReports.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SupportTab)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Queue List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900 uppercase">Incoming Tickets</h3>
              <span className="text-[11px] text-slate-500">{tickets.length} total</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900 truncate">{t.user_name}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                        t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : t.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{t.subject}</h4>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(t.created_at).toLocaleDateString()} • {t.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Ticket Conversation View */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
            {selectedTicket ? (
              <>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                          {selectedTicket.category}
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-black rounded uppercase">
                          {selectedTicket.priority} Priority
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-1.5">{selectedTicket.subject}</h3>
                      <p className="text-xs text-slate-400">
                        From: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_role}) • Opened: {new Date(selectedTicket.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'open')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${selectedTicket.status === 'open' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'in_progress')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${selectedTicket.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${selectedTicket.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Resolved ✓
                      </button>
                    </div>
                  </div>

                  {/* Original Student Issue Message */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Original Candidate Message:</span>
                    {selectedTicket.message}
                  </div>

                  {/* Thread Replies */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {selectedTicket.replies?.map((rep) => (
                      <div
                        key={rep.id}
                        className={`p-3.5 rounded-2xl text-xs max-w-lg ${
                          rep.is_admin
                            ? 'bg-blue-600 text-white ml-auto rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 mr-auto rounded-tl-none'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] opacity-80 mb-1">
                          <span className="font-bold">{rep.sender_name} {rep.is_admin && '(Support Officer)'}</span>
                          <span>{new Date(rep.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{rep.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type official placement support response..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select a ticket from the left panel to review and reply.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Student Self-Service FAQ Articles ({faqs.length})</h3>
          <div className="divide-y divide-slate-100">
            {faqs.map((f) => (
              <div key={f.id} className="py-3">
                <span className="text-[10px] font-bold text-blue-600 uppercase">{f.category}</span>
                <h4 className="font-bold text-xs text-slate-900 mt-0.5">{f.question}</h4>
                <p className="text-xs text-slate-600 mt-1">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUG REPORTS */}
      {activeTab === 'bugs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Technical Issue & Bug Reports ({bugReports.length})</h3>
          <div className="divide-y divide-slate-100">
            {bugReports.map((b) => (
              <div key={b.id} className="py-4 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{b.title}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                      b.status === 'fixed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{b.description}</p>
                  <span className="text-[10px] text-slate-400">Reported by: {b.reported_by} • Environment: {b.browser}</span>
                </div>

                {b.status !== 'fixed' && (
                  <button
                    onClick={() => handleResolveBug(b.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                  >
                    Mark Fixed ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
