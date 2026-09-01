'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React from 'react';
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  GraduationCap, 
  ShieldAlert, 
  FileText, 
  Users, 
  BarChart3, 
  CalendarCheck, 
  LogOut, 
  LogIn,
<<<<<<< HEAD
=======
  UserPlus,
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  BookOpen,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

<<<<<<< HEAD
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

=======
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  if (
    !user || 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/register' || 
    (pathname.includes('/student/tests/') && !pathname.includes('/results'))
  ) {
    return null;
  }

  const handleRoleChange = (newRole: 'student' | 'faculty' | 'admin') => {
    switchRole(newRole);
    if (newRole === 'student') router.push('/student');
    else if (newRole === 'faculty') router.push('/faculty');
    else if (newRole === 'admin') router.push('/admin');
  };

  const handleSignOut = async () => {
<<<<<<< HEAD
    setIsProfileOpen(false);
    await logout();
    router.replace('/login');
=======
    await logout();
    router.push('/login');
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">PlaceTrack <span className="text-blue-600">Pro</span></span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Placement Portal</span>
            </div>
          </Link>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {role === 'student' && (
              <>
                <Link 
                  href="/student" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/student' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  href="/student/analytics" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/analytics') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Performance AI
                </Link>
                <Link 
                  href="/student/attendance" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/attendance') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Attendance
                </Link>
              </>
            )}

            {role === 'faculty' && (
              <>
                <Link 
                  href="/faculty" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/faculty' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Faculty Hub
                </Link>
                <Link 
                  href="/faculty/question-banks" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/question-banks') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Question Banks
                </Link>
                <Link 
                  href="/faculty/attendance" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/faculty/attendance') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Absence Review
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link 
                  href="/admin" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Overview
                </Link>
                <Link 
                  href="/admin/proctoring" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/proctoring') ? 'bg-amber-50 text-amber-600 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <ShieldAlert className="w-4 h-4 mr-2 text-amber-500 animate-pulse" />
                  Live Proctoring
                </Link>
                <Link 
                  href="/admin/users" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/users') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  User & Batches
                </Link>
                <Link 
                  href="/admin/audit-logs" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/audit-logs') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Audit Logs
                </Link>
              </>
            )}
          </nav>

          {/* User Status / Role Switcher / Auth Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Role Switcher */}
<<<<<<< HEAD
            {role !== 'faculty' ? (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider hidden sm:inline">Role:</span>
                <button
                  onClick={() => handleRoleChange('student')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    role === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => handleRoleChange('faculty')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    (role as string) === 'faculty' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    role === 'admin' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 select-none">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                  FACULTY
                </span>
              </div>
            )}

            {/* Auth Buttons or Sign Out Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="block text-xs font-semibold text-slate-800 leading-tight">{user?.full_name}</span>
                    <span className="block text-[10px] text-slate-500 capitalize">{role === 'faculty' ? 'FACULTY' : role}</span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl py-3.5 px-4 z-50 text-slate-800 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                    <div className="space-y-3">
                      <div className="border-b border-slate-100 pb-2">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Details</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Full Name</span>
                        <span className="block text-xs font-extrabold text-slate-900">{user.full_name}</span>
                      </div>
                      {user.email && (
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
                          <span className="block text-xs font-mono text-slate-600 truncate">{user.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Department</span>
                        <span className="block text-xs font-semibold text-slate-700">{user.department}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Role</span>
                        <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-md tracking-wider border border-indigo-200">
                          {role === 'faculty' ? 'FACULTY' : role?.toUpperCase()}
                        </span>
                      </div>
                      <div className="border-t border-slate-100 pt-2.5 mt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center space-x-2 py-2 bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-600 font-bold text-xs rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
=======
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider hidden sm:inline">Role:</span>
              <button
                onClick={() => handleRoleChange('student')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange('faculty')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'faculty' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'admin' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Auth Buttons or Sign Out */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-xs font-semibold text-slate-800 leading-tight">{user?.full_name}</span>
                  <span className="block text-[10px] text-slate-500 capitalize">{role}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
>>>>>>> 405336aebf096f4e6de80aca2cdfa7d960f35ea4
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
