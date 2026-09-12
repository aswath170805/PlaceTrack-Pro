'use client';

import React, { useState, useEffect } from 'react';
import { PlaceTrackStore, ExtendedProfile, Department } from '@/lib/store';
import { Batch, VerificationRequest } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Building2,
  FolderGit2,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX,
  History,
  Activity,
  Camera,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  Shield,
  Clock,
  Mail,
  Phone,
  Check,
  X,
  RefreshCw,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';

type Tab = 'users' | 'departments' | 'batches' | 'verification' | 'login_history' | 'activity_logs';

export default function UserManagementPage() {
  const { user: currentAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<ExtendedProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loginRecords, setLoginRecords] = useState(PlaceTrackStore.loginRecords);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<ExtendedProfile | null>(null);
  const [showResetModal, setShowResetModal] = useState<{ user: ExtendedProfile; pass: string } | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<ExtendedProfile | null>(null);

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    full_name: '',
    email: '',
    role: 'student' as 'student' | 'faculty' | 'admin',
    department: 'CSE',
    year_of_study: '4th Year',
    phone: '',
    batch_id: '',
  });

  const [bulkCsvText, setBulkCsvText] = useState('');

  // Department & Batch Forms
  const [newDeptForm, setNewDeptForm] = useState({ name: '', code: '', hod_name: '' });
  const [newBatchName, setNewBatchName] = useState('');

  const syncState = () => {
    setUsers([...PlaceTrackStore.users]);
    setDepartments([...PlaceTrackStore.departments]);
    setBatches([...PlaceTrackStore.batches]);
    setVerificationRequests([...PlaceTrackStore.verificationRequests]);
    setLoginRecords([...PlaceTrackStore.loginRecords]);
  };

  useEffect(() => {
    syncState();
    const unsub = PlaceTrackStore.subscribe(() => {
      syncState();
    });
    return unsub;
  }, []);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // User Actions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.full_name || !newUserForm.email) return;

    PlaceTrackStore.createUser({
      ...newUserForm,
      status: 'active',
      is_verified: true,
    });

    setShowCreateModal(false);
    setNewUserForm({
      full_name: '',
      email: '',
      role: 'student',
      department: 'CSE',
      year_of_study: '4th Year',
      phone: '',
      batch_id: '',
    });
    showNotification(`User ${newUserForm.full_name} created successfully!`);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    PlaceTrackStore.updateUser(showEditModal.id, showEditModal);
    setShowEditModal(null);
    showNotification(`User details updated for ${showEditModal.full_name}!`);
  };

  const handleDeleteUser = (u: ExtendedProfile) => {
    if (confirm(`Are you sure you want to permanently delete ${u.full_name}?`)) {
      PlaceTrackStore.deleteUser(u.id);
      showNotification(`User ${u.full_name} deleted.`);
    }
  };

  const handleToggleStatus = (u: ExtendedProfile) => {
    const next = PlaceTrackStore.toggleUserStatus(u.id);
    showNotification(`User ${u.full_name} is now ${next.toUpperCase()}.`);
  };

  const handleResetPassword = (u: ExtendedProfile) => {
    const tempPass = PlaceTrackStore.resetPassword(u.id);
    setShowResetModal({ user: u, pass: tempPass });
  };

  const handleRoleChange = (userId: string, newRole: 'student' | 'faculty' | 'admin') => {
    PlaceTrackStore.updateUser(userId, { role: newRole });
    showNotification(`Role updated to ${newRole.toUpperCase()}!`);
  };

  const handleBulkImport = () => {
    if (!bulkCsvText.trim()) return;
    const lines = bulkCsvText.trim().split('\n');
    const toImport: Partial<ExtendedProfile>[] = [];

    // Parse header or assume format: Full Name, Email, Role, Department, Year
    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name')) return; // skip header
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        toImport.push({
          full_name: parts[0],
          email: parts[1],
          role: (parts[2] as any) || 'student',
          department: parts[3] || 'CSE',
          year_of_study: parts[4] || '4th Year',
        });
      }
    });

    const res = PlaceTrackStore.bulkImportUsers(toImport);
    setShowBulkModal(false);
    setBulkCsvText('');
    showNotification(`Bulk Import complete: ${res.added} users added, ${res.failed} skipped.`);
  };

  // Department Actions
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.name || !newDeptForm.code) return;
    PlaceTrackStore.addDepartment(newDeptForm.name, newDeptForm.code, newDeptForm.hod_name);
    setNewDeptForm({ name: '', code: '', hod_name: '' });
    showNotification(`Department ${newDeptForm.name} created!`);
  };

  const handleDeleteDept = (id: string, name: string) => {
    if (confirm(`Delete department ${name}?`)) {
      PlaceTrackStore.deleteDepartment(id);
      showNotification(`Department ${name} deleted.`);
    }
  };

  // Batch Actions
  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;
    PlaceTrackStore.addBatch(newBatchName.trim(), currentAdmin?.full_name || 'Placement Admin');
    setNewBatchName('');
    showNotification(`Batch "${newBatchName}" created!`);
  };

  const handleDeleteBatch = (id: string, name: string) => {
    if (confirm(`Delete batch ${name}?`)) {
      PlaceTrackStore.deleteBatch(id);
      showNotification(`Batch ${name} deleted.`);
    }
  };

  // Verification Actions
  const handleApproveReq = (req: VerificationRequest) => {
    PlaceTrackStore.updateUser(req.user_id, { is_verified: true });
    req.status = 'approved';
    PlaceTrackStore.logAudit('APPROVE_REGISTRATION', 'verification_requests', req.id, { user_id: req.user_id });
    showNotification(`Approved registration for ${req.user_name}!`);
  };

  const handleRejectReq = (req: VerificationRequest) => {
    PlaceTrackStore.updateUser(req.user_id, { is_verified: false });
    req.status = 'rejected';
    PlaceTrackStore.logAudit('REJECT_REGISTRATION', 'verification_requests', req.id, { user_id: req.user_id });
    showNotification(`Rejected registration for ${req.user_name}.`);
  };

  // Photo Update
  const handleSavePhoto = (newUrl: string) => {
    if (!showPhotoModal) return;
    PlaceTrackStore.updateUser(showPhotoModal.id, { avatar_url: newUrl });
    setShowPhotoModal(null);
    showNotification('Profile avatar updated!');
  };

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchDept = deptFilter === 'all' || u.department.toLowerCase() === deptFilter.toLowerCase();
    return matchSearch && matchRole && matchDept;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Feature 1: User Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institutional User Directory & Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full user lifecycle control: create, bulk import, role assignment, departments, batches, authentication logs & photos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            Bulk CSV Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add New User
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: 'users', label: 'All Users', icon: Users, count: users.length },
          { id: 'departments', label: 'Departments', icon: Building2, count: departments.length },
          { id: 'batches', label: 'Student Batches', icon: FolderGit2, count: batches.length },
          { id: 'verification', label: 'Verification Queue', icon: UserCheck, count: verificationRequests.filter(r => r.status === 'pending').length },
          { id: 'login_history', label: 'Login History', icon: History, count: loginRecords.length },
          { id: 'activity_logs', label: 'Activity Logs', icon: Activity, count: PlaceTrackStore.auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
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

      {/* TAB 1: ALL USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, email, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>{d.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Dept & Year</th>
                    <th className="p-3.5">Batch</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No users match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="relative group cursor-pointer" onClick={() => setShowPhotoModal(u)}>
                              <img
                                src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                                alt={u.full_name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">{u.full_name}</span>
                              <span className="text-[11px] text-slate-400 block">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border focus:outline-none ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : u.role === 'faculty'
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                : 'bg-blue-100 text-blue-900 border-blue-300'
                            }`}
                          >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="p-3.5 font-semibold text-slate-700">
                          <span>{u.department}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{u.year_of_study}</span>
                        </td>

                        <td className="p-3.5 text-slate-600 font-medium">
                          {batches.find((b) => b.id === u.batch_id)?.name || '—'}
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              u.status === 'deactivated'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'deactivated' ? (
                              <>
                                <UserX className="w-3 h-3 mr-1 text-red-600" />
                                Suspended
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Active
                              </>
                            )}
                          </button>
                        </td>

                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleResetPassword(u)}
                            title="Force Password Reset"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-amber-600 rounded-lg transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowEditModal(u)}
                            title="Edit User Details"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            title="Permanently Delete"
                            className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-blue-600" />
              Add New Academic Department
            </h3>
            <form onSubmit={handleAddDept} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Biomedical Engineering"
                  value={newDeptForm.name}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department Code</label>
                <input
                  type="text"
                  placeholder="e.g. BME"
                  value={newDeptForm.code}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">HOD / Placement Coordinator</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. A. Johnson"
                  value={newDeptForm.hod_name}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, hod_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Create Department
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Institutional Departments ({departments.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {departments.map((d) => (
                <div key={d.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                      {d.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1.5">{d.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">HOD: {d.hod_name || 'N/A'}</p>
                    <div className="flex space-x-3 text-[10px] text-slate-400 mt-2">
                      <span>Students: <strong>{users.filter(u => u.department === d.code).length}</strong></span>
                      <span>Faculty: <strong>{d.faculty_count}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDept(d.id, d.name)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BATCHES */}
      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <FolderGit2 className="w-4 h-4 mr-2 text-indigo-600" />
              Create Placement Batch
            </h3>
            <form onSubmit={handleAddBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. CS-2026 Batch C"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
              >
                Add Batch
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Active Batches ({batches.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{b.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Created by: {b.created_by || 'Admin'}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Assigned Students: <strong>{users.filter(u => u.batch_id === b.id).length}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteBatch(b.id, b.name)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pending User Verification Requests</h3>
              <p className="text-xs text-slate-500">Approve or reject new self-registered students or faculty members</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {verificationRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No access requests currently logged.
              </div>
            ) : (
              verificationRequests.map((req) => (
                <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{req.user_name || 'Candidate'}</span>
                    <span className="text-[11px] text-slate-500 block">{req.email} • {req.department} ({req.role})</span>
                    <span className="text-[10px] text-slate-400">Requested on: {new Date(req.created_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>

                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveReq(req)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectReq(req)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LOGIN HISTORY */}
      {activeTab === 'login_history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institutional Login Records</h3>
              <p className="text-xs text-slate-500">Security audit trail of user access, IP addresses, and authentication outcomes</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{loginRecords.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Email</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Device & Browser</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loginRecords.map((lr) => (
                  <tr key={lr.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{new Date(lr.timestamp).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{lr.user_name}</span>
                      <span className="text-[11px] text-slate-400">{lr.email}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{lr.ip_address}</td>
                    <td className="p-3 text-slate-600">{lr.device}</td>
                    <td className="p-3 text-slate-600">{lr.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        lr.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {lr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ACTIVITY LOGS */}
      {activeTab === 'activity_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">User Action Tracking Trail</h3>
          <p className="text-xs text-slate-500">Chronological history of mutations recorded by the system engine</p>

          <div className="divide-y divide-slate-100">
            {PlaceTrackStore.auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[10px] rounded uppercase font-bold">
                      {log.action}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{log.actor_name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Target: <strong className="text-slate-700">{log.target_table}</strong> {log.target_id && `(#${log.target_id})`}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-blue-600" />
                Add Institutional Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh K"
                  value={newUserForm.full_name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official College Email</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh.k@svce.ac.in"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newUserForm.role === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Year of Study</label>
                    <select
                      value={newUserForm.year_of_study}
                      onChange={(e) => setNewUserForm({ ...newUserForm, year_of_study: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Assign Batch</label>
                    <select
                      value={newUserForm.batch_id}
                      onChange={(e) => setNewUserForm({ ...newUserForm, batch_id: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="">None</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK CSV IMPORT */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
                Bulk User Import (CSV / Excel)
              </h3>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste comma-separated rows with columns: <strong className="text-slate-800">Full Name, Email, Role, Department, Year</strong>
            </p>

            <textarea
              rows={6}
              placeholder="Alex Johnson, alex.j@svce.ac.in, student, CSE, 4th Year&#10;Dr. Sarah Connor, sarah.c@svce.ac.in, faculty, CSE, N/A"
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs text-xs"
              >
                Parse & Import Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Edit User Details</h3>
            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={showEditModal.full_name}
                  onChange={(e) => setShowEditModal({ ...showEditModal, full_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={showEditModal.email || ''}
                  onChange={(e) => setShowEditModal({ ...showEditModal, email: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select
                    value={showEditModal.department}
                    onChange={(e) => setShowEditModal({ ...showEditModal, department: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Year</label>
                  <input
                    type="text"
                    value={showEditModal.year_of_study}
                    onChange={(e) => setShowEditModal({ ...showEditModal, year_of_study: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Password Reset Generated</h3>
              <p className="text-xs text-slate-500 mt-1">
                A temporary password was generated for <strong>{showResetModal.user.full_name}</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl font-mono text-sm font-black text-slate-800 tracking-wider">
              {showResetModal.pass}
            </div>
            <button
              onClick={() => setShowResetModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PROFILE PHOTO */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Manage Profile Photo</h3>
            <div className="flex justify-center">
              <img
                src={showPhotoModal.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={showPhotoModal.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
            </div>
            <input
              type="text"
              defaultValue={showPhotoModal.avatar_url || ''}
              id="photoUrlInput"
              placeholder="Paste new image URL..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPhotoModal(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('photoUrlInput') as HTMLInputElement;
                  if (input) handleSavePhoto(input.value);
                }}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Update Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
