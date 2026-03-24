import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Eye, Edit2, Trash2, Plus,
  CheckCircle, XCircle, Clock, TrendingUp, Save, X, AlertTriangle
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { jobCategories, jobTypes } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { getCompanyJobs, createJob, deleteJob, getJobApplicants, updateApplicationStatus } from './api';

const statusConfig = {
  Applied: { color: 'bg-blue-100 text-blue-700', label: 'Applied' },
  Reviewing: { color: 'bg-amber-100 text-amber-700', label: 'Reviewing' },
  Rejected: { color: 'bg-red-100 text-red-600', label: 'Rejected' },
  Hired: { color: 'bg-emerald-100 text-emerald-700', label: 'Hired' },
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsData = await getCompanyJobs();
      const fetchedJobs = jobsData.results || jobsData || [];
      setJobs(fetchedJobs);
      
      const allJobAppsPromises = fetchedJobs.map(job => 
        getJobApplicants(job.id).then(res => 
          (res.results || []).map(app => ({
            ...app,
            job: job.title,
            name: app.applicant_name,
            email: app.applicant_email,
          }))
        )
      );
      const appsArrays = await Promise.all(allJobAppsPromises);
      setApplicants(appsArrays.flat());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const stats = [
    { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Applicants', value: applicants.length, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Under Review', value: applicants.filter(a => a.status === 'Reviewing').length, icon: Eye, color: 'bg-amber-50 text-amber-600' },
    { label: 'Hired', value: applicants.filter(a => a.status === 'Hired').length, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const handlePostJob = async (data) => {
    try {
      const payload = {
        ...data,
        openings: parseInt(data.openings) || 1,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        requirements: data.requirements ? data.requirements.split('\n').map(r => r.trim()).filter(Boolean) : [],
      };
      await createJob(payload);
      setSubmitSuccess(true);
      reset();
      await fetchData();
      setTimeout(() => { setSubmitSuccess(false); setActiveTab('jobs'); }, 1500);
    } catch (err) {
      console.error("Failed to post job");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete job");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-7">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 min-w-0">
          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">{user?.company_name || 'TechCorp India'} · Recruiter</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card p-5">
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={18} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Active Jobs Summary */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 font-display">Active Job Posts</h2>
                  <button onClick={() => setActiveTab('post-job')} className="btn-primary text-sm flex items-center gap-1.5">
                    <Plus size={14} /> Post New Job
                  </button>
                </div>
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No jobs posted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.map(job => (
                      <div key={job.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate font-display">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.location} · {job.job_type}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900">{job.applicants}</p>
                          <p className="text-xs text-gray-400">applicants</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Applicants */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 font-display">Recent Applicants</h2>
                  <button onClick={() => setActiveTab('applicants')} className="text-sm text-primary-600 hover:underline font-medium">View all</button>
                </div>
                <div className="space-y-3">
                  {applicants.slice(0, 4).map(app => (
                    <div key={app.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{app.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate font-display">{app.name}</p>
                        <p className="text-xs text-gray-400 truncate">{app.job}</p>
                      </div>
                      <span className={`badge text-xs ${statusConfig[app.status]?.color}`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── POST JOB ── */}
          {activeTab === 'post-job' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 font-display">Post a New Job</h2>
              {submitSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700">
                  <CheckCircle size={16} /> Job posted successfully! Redirecting...
                </div>
              )}
              <form onSubmit={handleSubmit(handlePostJob)}>
                <div className="card p-6 space-y-5 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                      <input placeholder="e.g. Senior Frontend Developer" className="input-field text-sm" {...register('title', { required: 'Job title is required' })} />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                      <input placeholder="e.g. Bangalore, Karnataka" className="input-field text-sm" {...register('location', { required: 'Location is required' })} />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
                      <select className="input-field text-sm" {...register('job_type', { required: true })}>
                        {jobTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                      <select className="input-field text-sm" {...register('category', { required: true })}>
                        {jobCategories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                      <input placeholder="e.g. ₹12,00,000 – ₹18,00,000/yr" className="input-field text-sm" {...register('salary')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Openings</label>
                      <input type="number" min="1" defaultValue="1" className="input-field text-sm" {...register('openings')} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
                      <textarea rows={5} placeholder="Describe the role, responsibilities, and what you're looking for..." className="input-field text-sm resize-none" {...register('description', { required: 'Description is required' })} />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills</label>
                      <input placeholder="React, TypeScript, Node.js (comma separated)" className="input-field text-sm" {...register('skills')} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2 text-sm">
                      {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Posting...</> : <><Plus size={15} />Post Job</>}
                    </button>
                    <button type="button" onClick={() => reset()} className="btn-secondary text-sm">Clear Form</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── MY JOBS ── */}
          {activeTab === 'jobs' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 font-display">My Job Posts</h2>
                <button onClick={() => setActiveTab('post-job')} className="btn-primary text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Post New Job
                </button>
              </div>
              {jobs.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-bold text-gray-900 mb-2 font-display">No jobs posted yet</h3>
                  <p className="text-gray-500 text-sm mb-5">Start hiring by posting your first job.</p>
                  <button onClick={() => setActiveTab('post-job')} className="btn-primary text-sm">Post a Job</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 font-display">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{job.location}</span>
                            <span className="text-gray-300">·</span>
                            <span className="badge bg-primary-50 text-primary-700 text-xs">{job.job_type}</span>
                            <span className="badge bg-gray-100 text-gray-600 text-xs">{job.category}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900 font-display">{job.applicants}</p>
                              <p className="text-xs text-gray-400">Applicants</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900 font-display">{job.openings}</p>
                              <p className="text-xs text-gray-400">Openings</p>
                            </div>
                            <p className="text-xs text-gray-400 self-end pb-0.5">
                              Posted {new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Link to={`/jobs/${job.id}`} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 px-3 py-2 rounded-lg transition-colors">
                            <Eye size={13} /> View
                          </Link>
                          <button onClick={() => setActiveTab('post-job')} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-amber-700 px-3 py-2 rounded-lg transition-colors">
                            <Edit2 size={13} /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(job.id)} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-lg transition-colors">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── APPLICANTS ── */}
          {activeTab === 'applicants' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 font-display">All Applicants</h2>
                <span className="text-sm text-gray-500">{applicants.length} total</span>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Applicant', 'Applied For', 'Skills', 'Date', 'Status', 'Action'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 font-display">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applicants.map(app => {
                      const { color } = statusConfig[app.status] || {};
                      return (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{app.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 font-display">{app.name}</p>
                                <p className="text-xs text-gray-400">{app.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{app.job}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {app.skills.map(s => (
                                <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td className="px-4 py-3">
                            <span className={`badge text-xs ${color}`}>{app.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select 
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white"
                              value={app.status || "Applied"}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                try {
                                  await updateApplicationStatus(app.id, newStatus);
                                  setApplicants(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
                                } catch (err) {
                                  alert("Failed to update status");
                                }
                              }}
                            >
                              {Object.keys(statusConfig).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMPANY PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 font-display">Company Profile</h2>
              <div className="card p-6 max-w-2xl space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">T</span>
                  </div>
                  <button className="text-sm text-primary-600 border border-primary-200 rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors">Upload Logo</button>
                </div>
                {[['Company Name', user?.company_name || 'TechCorp India', 'text'], ['Industry', 'Technology', 'text'], ['Company Size', '51-200 employees', 'text'], ['Website', 'https://techcorp.in', 'url'], ['Location', 'Bangalore, Karnataka', 'text']].map(([label, val, type]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type={type} defaultValue={val} className="input-field text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Description</label>
                  <textarea rows={4} defaultValue="A leading technology company building innovative solutions for modern businesses." className="input-field text-sm resize-none" />
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><Save size={15} />Save Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 font-display">Delete Job Post?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">This will permanently delete this job post and all associated applications. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteJob(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
