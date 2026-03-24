import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import ResumeUpload from "../components/ResumeUpload";
import { getProfile, getApplications, updateProfile, uploadResume } from "./api";

export default function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const profileData = await getProfile().catch(() => ({}));
      const appsData = await getApplications().catch(() => ([]));
      
      setProfile(profileData);
      setName(profileData.name || "");
      setPhone(profileData.phone || "");
      setBio(profileData.bio || "");
      
      setApplications(appsData.results || appsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await updateProfile({ name, phone, bio });
      if (updated.user) {
         setProfile(updated.user);
         // Also update localStorage so sidebar/navbar instantly reflects changes
         let userCache = JSON.parse(localStorage.getItem('user') || '{}');
         userCache = { ...userCache, name, phone, bio };
         localStorage.setItem('user', JSON.stringify(userCache));
         // Dispatch an event so AuthContext knows (if they listen) or a simple reload is needed for sidebar depending on context setup 
         alert("Profile updated successfully!");
      }
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      const res = await uploadResume(file);
      if (res.resume_url) {
         await fetchData();
         alert("Resume uploaded successfully!");
      }
    } catch (err) {
      alert("Failed to upload resume");
    }
  };

  const currentResumeUrl = profile?.applicant_profile?.resume;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <div className="spinner"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">Total Applications</p>
                <div className="text-3xl font-display font-bold text-gray-900">{applications.length}</div>
              </div>
              <div className="card p-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">Interviews Scheduled</p>
                <div className="text-3xl font-display font-bold text-primary-600">0</div>
              </div>
              <div className="card p-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">Profile Views</p>
                <div className="text-3xl font-display font-bold text-accent-500">24</div>
              </div>
            </div>

            {/* Applications Preview */}
            <div className="card overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-display font-bold text-lg text-gray-900">Recent Applications</h3>
                <span className="badge bg-primary-50 text-primary-700 cursor-pointer" onClick={() => setActiveTab("applications")}>See All</span>
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {applications.slice(0, 3).length === 0 ? (
                  <div className="p-8 text-center text-gray-500">You haven't applied to any jobs yet.</div>
                ) : (
                  applications.slice(0, 3).map((app, i) => (
                    <ApplicationRow key={i} app={app} />
                  ))
                )}
              </div>
            </div>
            
            {/* Quick Profile Info */}
            <div className="card p-6 bg-white">
               <h3 className="font-display font-bold text-lg text-gray-900 mb-4">My Information</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                    <p className="font-semibold text-gray-900 mt-1">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                    <p className="font-semibold text-gray-900 mt-1">{profile.email}</p>
                  </div>
               </div>
            </div>
          </div>
        );

      case "applications":
        return (
          <div className="card overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-gray-100 bg-white">
              <h3 className="font-display font-bold text-lg text-gray-900">All Applications</h3>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {applications.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">You haven't applied to any jobs yet.</div>
              ) : (
                 applications.map((app, i) => <ApplicationRow key={i} app={app} />)
              )}
            </div>
          </div>
        );

      case "resume":
        return (
          <div className="card p-6 bg-white animate-fade-in max-w-2xl">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Resume Management</h3>
            <p className="text-gray-500 mb-6">Upload your latest resume to automatically include it in applications.</p>
            <ResumeUpload 
              currentResume={currentResumeUrl} 
              onUpload={handleResumeUpload} 
            />
          </div>
        );

      case "profile":
        return (
          <div className="card p-6 bg-white animate-fade-in max-w-2xl">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Edit Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address (Read Only)</label>
                <input 
                  type="text" 
                  className="input-field bg-gray-50 cursor-not-allowed" 
                  value={profile?.email || ""} 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Bio / Professional Summary</label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder="Tell companies a little about yourself..."
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          {activeTab === 'overview' && 'Applicant Dashboard'}
          {activeTab === 'applications' && 'My Applications'}
          {activeTab === 'resume' && 'My Resume'}
          {activeTab === 'profile' && 'Edit Profile'}
        </h1>
        <p className="text-gray-500 font-body mb-8">
          {activeTab === 'overview' && 'Welcome back! Here is an overview of your job applications.'}
          {activeTab === 'applications' && 'Track the status of all your job submissions.'}
          {activeTab === 'resume' && 'Keep your resume updated to stand out to employers.'}
          {activeTab === 'profile' && 'Manage your personal information and contact details.'}
        </p>
        
        {renderContent()}
      </div>
    </div>
  );
}

function ApplicationRow({ app }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-900 font-display">{app.job?.title || app.job_title || "Application"}</h4>
        <p className="text-sm text-gray-500 mt-1 font-body">
           {app.job?.company_name || app.company_name || ""} • 
           Applied on {new Date(app.applied_at || Date.now()).toLocaleDateString()}
        </p>
      </div>
      <span className={`badge ${
         app.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
         app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
         app.status === 'Reviewing' ? 'bg-amber-100 text-amber-700' :
         'bg-blue-100 text-blue-700'
      }`}>
        {app.status || "Pending"}
      </span>
    </div>
  );
}