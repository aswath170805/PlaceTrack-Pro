'use client';

import React, { useState } from 'react';
import { MOCK_PROFILES, MOCK_BATCHES, Profile, Batch } from '@/lib/mockData';
import { Users, UserPlus, Shield, GraduationCap, School, CheckCircle2 } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<Profile[]>(MOCK_PROFILES);
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);

  const handleRoleChange = (userId: string, newRole: 'student' | 'faculty' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Identity & Governance</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">User & Batch Management</h1>
            <p className="text-xs text-slate-500">Manage user accounts, assign roles, and organize student batches</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">User Accounts Directory</h3>
            <span className="text-xs font-semibold text-slate-500">Total Accounts: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {u.full_name.charAt(0)}
                      </div>
                      <span>{u.full_name}</span>
                    </td>
                    <td className="p-4 text-slate-600">{u.department}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : u.role === 'faculty' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
