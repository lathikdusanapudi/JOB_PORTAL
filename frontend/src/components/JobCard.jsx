import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Banknote, Users, Bookmark, ArrowRight } from 'lucide-react';

const typeColors = {
  'Full-time': 'bg-emerald-100 text-emerald-700',
  'Part-time': 'bg-amber-100 text-amber-700',
  'Remote': 'bg-blue-100 text-blue-700',
  'Internship': 'bg-purple-100 text-purple-700',
  'Contract': 'bg-orange-100 text-orange-700',
};

const categoryIcons = {
  Technology: '💻',
  Design: '🎨',
  Marketing: '📈',
  Management: '📋',
  'Data Science': '🔬',
  Finance: '💰',
  Content: '✍️',
  Sales: '🤝',
  HR: '👥',
};

export default function JobCard({ job, compact = false }) {
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  const initials = job.company_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient = ['from-indigo-500 to-blue-500', 'from-violet-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500'][job.id % 5];

  if (compact) {
    return (
      <Link to={`/jobs/${job.id}`} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary-50 transition-all duration-200 group border border-transparent hover:border-primary-100">
        <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-sm font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-700 font-display">{job.title}</p>
          <p className="text-xs text-gray-500 truncate">{job.company_name} · {job.location}</p>
        </div>
        <span className={`badge text-xs ${typeColors[job.job_type] || 'bg-gray-100 text-gray-600'} flex-shrink-0`}>
          {job.job_type}
        </span>
      </Link>
    );
  }

  return (
    <div className="card p-6 group cursor-pointer flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-primary-700 transition-colors font-display">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>
          </div>
        </div>
        <button className="p-2 rounded-lg text-gray-300 hover:text-primary-500 hover:bg-primary-50 transition-all duration-200 flex-shrink-0">
          <Bookmark size={16} />
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${typeColors[job.job_type] || 'bg-gray-100 text-gray-600'}`}>
          {job.job_type}
        </span>
        <span className="badge bg-primary-50 text-primary-700">
          {categoryIcons[job.category] || '📌'} {job.category}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={13} className="text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Banknote size={13} className="text-gray-400" />
          <span className="font-medium text-gray-700">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users size={13} />
          <span>{job.applicants} applicants</span>
          <span className="mx-1">·</span>
          <Clock size={13} />
          <span>{timeAgo(job.created_at)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400">{job.openings} opening{job.openings > 1 ? 's' : ''}</span>
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group-hover:gap-2.5 transition-all duration-200 font-display"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
