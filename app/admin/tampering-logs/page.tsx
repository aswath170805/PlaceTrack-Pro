'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Clock, User } from 'lucide-react';

type TamperingLog = { id: string; student_id: string; event_type: string; metadata: Record<string, unknown>; created_at: string };

export default function TamperingLogsPage() {
  const [events, setEvents] = useState<TamperingLog[]>([]);

  useEffect(() => {
    fetch('/api/tampering').then((response) => response.json()).then((payload) => setEvents(payload.logs || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-2"><ShieldAlert className="w-3.5 h-3.5" />Assessment integrity</div>
          <h1 className="text-2xl font-black text-slate-900">Tampering Logs</h1>
          <p className="text-xs text-slate-500">Tab switches, defocus events, unauthorized keys, and copy-paste attempts with timestamps and student context.</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {events.length === 0 ? <p className="p-8 text-sm text-slate-500">No tampering events recorded.</p> : events.map((event) => (
            <div key={event.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-amber-100 text-amber-700"><ShieldAlert className="w-4 h-4" /></div><div><p className="text-sm font-bold text-slate-900 capitalize">{event.event_type.replaceAll('_', ' ')}</p><p className="text-xs text-slate-500 flex items-center gap-1"><User className="w-3 h-3" />Student {event.student_id}</p></div></div>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(event.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
