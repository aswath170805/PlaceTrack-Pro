'use client';

import React, { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/dbService';
import { MOCK_BATCHES, Profile, Batch } from '@/lib/mockData';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Live Real-Time Database Sync Polling for Pending Verifications
  useEffect(() => {
    async function syncUserData() {
      setIsRefreshing(true);
      const allProfiles = await DatabaseService.getProfiles();
      setUsers(allProfiles.filter((p) => p.is_verified));
      setPendingUsers(allProfiles.filter((p) => !p.is_verified));
      setIsRefreshing(false);
    }

    syncUserData();
    const syncInterval = setInterval(syncUserData, 3000);
    return () => clearInterval(syncInterval);
  }, []);

  const handleGrantAccess = async (userId: string, name: string) => {
    const requests = await DatabaseService.getVerificationRequests();
    const req = requests.find((r) => r.user_id === userId && r.status === 'pending');
    if (req) {
      await DatabaseService.approveVerificationRequest(req.id, userId);
    } else {
      await DatabaseService.createProfile({ id: userId, full_name: name, is_verified: true });
    }
    
    // Update local state live
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    const allProfiles = await DatabaseService.getProfiles();
    setUsers(allProfiles.filter((p) => p.is_verified));

    setActionSuccess(`Access Granted to ${name}! Account is now verified in database.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRevokeAccess = async (userId: string, name: string) => {
    const requests = await DatabaseService.getVerificationRequests();
    const req = requests.find((r) => r.user_id === userId && r.status === 'pending');
    if (req) {
      await DatabaseService.rejectVerificationRequest(req.id, userId);
    }
    
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    const allProfiles = await DatabaseService.getProfiles();
    setPendingUsers(allProfiles.filter((p) => !p.is_verified));

    setActionSuccess(`Access Revoked for ${name}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRoleChange = async (userId: string, newRole: 'student' | 'faculty' | 'admin') => {
    await DatabaseService.updateProfileRole(userId, newRole);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Identity & Account Verification Desk</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">User Governance & Access Control Desk</h1>
            <p className="text-xs text-slate-500">Live sync: Verify new student & teacher registrations (@svce.ac.in) and manage system permissions</p>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs text-slate-500 font-mono">
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Live DB Sync Active</span>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1. Real-Time Pending Verification Requests Desk */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-md overflow-hidden">
          <div className="p-6 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">Real-Time Pending Account Verification Requests</h3>
            </div>
            <span className="px-3 py-1 bg-amber-200 text-amber-900 text-xs font-black rounded-full">
              {pendingUsers.length} Pending Approval
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No pending account verification requests. All registered students and teachers are verified!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingUsers.map((pu) => (
                <div key={pu.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-amber-50/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{pu.full_name}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        pu.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {pu.role === 'student' ? 'Student Request' : 'Faculty Request'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-mono">
                      Email: <strong className="text-blue-700">{pu.email || 'student@svce.ac.in'}</strong> • Dept: <strong>{pu.department}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">Registered on {new Date(pu.created_at).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleGrantAccess(pu.id, pu.full_name)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center"
                    >
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      Grant Access (Approve)
                    </button>
                    <button
                      onClick={() => handleRevokeAccess(pu.id, pu.full_name)}
                      className="px-3 py-2 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-600 font-bold text-xs rounded-xl transition-all flex items-center"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Verified Active Users Directory */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Verified Active Accounts Directory</h3>
            <span className="text-xs font-semibold text-slate-500">Active Verified Accounts: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">College Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Role Permission</th>
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
                    <td className="p-4 font-mono text-slate-600">{u.email || 'user@svce.ac.in'}</td>
                    <td className="p-4 text-slate-600">{u.department}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : u.role === 'faculty' ? 'bg-indigo-100 text-indigo-900' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleRevokeAccess(u.id, u.full_name)}
                          className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[11px] font-bold"
                        >
                          Revoke Access
                        </button>
                      )}
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
