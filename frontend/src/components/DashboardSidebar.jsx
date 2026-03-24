import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, User,
  PlusCircle, Users, Settings, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ activeTab, setActiveTab }) {
  const { user, isCompany } = useAuth();
  const location = useLocation();

  const applicantMenuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'applications', icon: Briefcase, label: 'My Applications' },
    { id: 'resume', icon: FileText, label: 'Resume' },
    { id: 'profile', icon: User, label: 'Edit Profile' },
  ];

  const companyMenuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'post-job', icon: PlusCircle, label: 'Post a Job' },
    { id: 'jobs', icon: Briefcase, label: 'My Job Posts' },
    { id: 'applicants', icon: Users, label: 'Applicants' },
    { id: 'profile', icon: Settings, label: 'Company Profile' },
  ];

  const menuItems = isCompany ? companyMenuItems : applicantMenuItems;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="w-64 flex-shrink-0">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate font-display">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isCompany ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isCompany ? '🏢 Company' : '👤 Job Seeker'}
            </span>
          </div>
        </div>
        {!isCompany && (
          <div className="bg-primary-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary-700">Profile Completion</span>
              <span className="text-xs font-bold text-primary-700">65%</span>
            </div>
            <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <nav>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
              >
                <Icon size={16} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''} font-display`}>
                  {item.label}
                </span>
                {isActive && <ChevronRight size={14} className="ml-auto text-primary-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Link */}
      <div className="mt-4">
        <Link
          to="/jobs"
          className="block w-full text-center text-sm text-primary-600 hover:text-primary-800 font-medium py-2 px-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 transition-all duration-200"
        >
          {isCompany ? 'Browse Talent Pool →' : 'Browse All Jobs →'}
        </Link>
      </div>
    </div>
  );
}
