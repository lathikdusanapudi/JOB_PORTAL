import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Banknote, Calendar, Users, Building2,
  Globe, CheckCircle, ArrowLeft, Bookmark, Share2, Clock,
  ChevronRight, AlertCircle, X
} from 'lucide-react';
import JobCard from '../components/JobCard';
import { getJobById, getJobs, applyForJob } from './api';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import ResumeUpload from '../components/ResumeUpload';

const typeColors = {
  'Full-time': 'bg-emerald-100 text-emerald-700',
  'Part-time': 'bg-amber-100 text-amber-700',
  'Remote': 'bg-blue-100 text-blue-700',
  'Internship': 'bg-purple-100 text-purple-700',
  'Contract': 'bg-orange-100 text-orange-700',
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      try {
        const jobData = await getJobById(id);
        setJob(jobData);
        
        const related = await getJobs({ category: jobData.category, page_size: 4 });
        setSimilarJobs((related.results || []).filter(j => j.id !== jobData.id).slice(0, 3));
      } catch (err) {
        console.error("Error fetching job details", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
    window.scrollTo(0, 0);
  }, [id]);

  const onApply = async (data) => {
    setSubmitting(true);
    try {
        await applyForJob(job.id, { cover_letter: data.cover_letter });
        setApplied(true);
        setApplyModal(false);
        reset();
    } catch (err) {
        console.error("Failed to apply", err);
        alert("Failed to apply. You might have already applied.");
    } finally {
        setSubmitting(false);
    }
  };

  const formatDate = (str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">😕</div>
      <h2 className="text-2xl font-bold text-gray-900 font-display">Job Not Found</h2>
      <p className="text-gray-500">This job listing may have been removed.</p>
      <Link to="/jobs" className="btn-primary text-sm">Browse All Jobs</Link>
    </div>
  );

  const initials = job.company_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient = ['from-indigo-500 to-blue-500', 'from-violet-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500'][job.id % 5];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/jobs" className="hover:text-primary-600 transition-colors">Jobs</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <span className="text-white text-xl font-bold">{initials}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display leading-tight">{job.title}</h1>
                    <p className="text-primary-600 font-semibold mt-0.5">{job.company_name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className={`badge ${typeColors[job.job_type] || 'bg-gray-100 text-gray-600'}`}>{job.job_type}</span>
                      <span className="badge bg-primary-50 text-primary-700">{job.category}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSaved(!saved)} className={`p-2.5 rounded-xl border transition-all duration-200 ${saved ? 'bg-primary-50 border-primary-200 text-primary-600' : 'border-gray-200 text-gray-400 hover:border-primary-200 hover:text-primary-500'}`}>
                  <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <InfoChip icon={MapPin} label="Location" value={job.location} />
                <InfoChip icon={Banknote} label="Salary" value={job.salary} />
                <InfoChip icon={Users} label="Openings" value={`${job.openings} position${job.openings > 1 ? 's' : ''}`} />
                <InfoChip icon={Calendar} label="Posted" value={formatDate(job.created_at)} />
              </div>

              {/* Apply Actions */}
              {applied ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700">
                  <CheckCircle size={18} />
                  <span className="font-semibold text-sm">Application submitted! We'll notify you of updates.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => user ? setApplyModal(true) : navigate('/login')}
                    className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
                  >
                    <Briefcase size={16} />
                    {user ? 'Apply Now' : 'Login to Apply'}
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Share2 size={16} /> Share Job
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Job Description</h2>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-body">{job.description}</div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Requirements</h2>
              <ul className="space-y-2.5">
                {(Array.isArray(job.requirements) ? job.requirements : (typeof job.requirements === 'string' ? job.requirements.split('\n') : [])).filter(Boolean).map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(job.skills) ? job.skills : (typeof job.skills === 'string' ? job.skills.split(',') : [])).filter(Boolean).map((skill) => (
                  <span key={skill} className="bg-primary-50 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full border border-primary-100">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 font-display">About the Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold">{initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm font-display">{job.company_name}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Building2 size={13} className="text-gray-400" />
                  <span>{job.category} Industry</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-gray-400" />
                  <span className="text-primary-600 hover:underline cursor-pointer">Visit Website</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-gray-400" />
                  <span>{job.applicants} applicants so far</span>
                </div>
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
              <h3 className="font-bold text-primary-900 mb-3 font-display">Job Summary</h3>
              <div className="space-y-2">
                {[
                  ['Posted Date', formatDate(job.created_at)],
                  ['Job Type', job.job_type],
                  ['Category', job.category],
                  ['Salary', job.salary],
                  ['Openings', `${job.openings}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-primary-600">{label}</span>
                    <span className="font-medium text-primary-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 font-display">Similar Jobs</h3>
                <div className="space-y-1">
                  {similarJobs.map(j => <JobCard key={j.id} job={j} compact />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setApplyModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 font-display">Apply for Position</h3>
                <p className="text-sm text-gray-500 mt-0.5">{job.title} · {job.company_name}</p>
              </div>
              <button onClick={() => setApplyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onApply)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter</label>
                <textarea
                  rows={4}
                  placeholder="Tell the company why you're a great fit..."
                  className="input-field resize-none text-sm"
                  {...register('cover_letter', { required: 'Cover letter is required' })}
                />
                {errors.cover_letter && <p className="text-red-500 text-xs mt-1">{errors.cover_letter.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume</label>
                <ResumeUpload onUpload={() => {}} />
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-primary flex items-center justify-center gap-2">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoChip = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
      <Icon size={12} />
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-800 leading-tight font-display">{value}</p>
  </div>
);
