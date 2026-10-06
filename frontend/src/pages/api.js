const BASE_URL = "https://job-portal-backend-db2g.onrender.com/api";


export const loginUser = async (data) => {
    const res = await fetch(`${BASE_URL}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.access) {
        localStorage.setItem("access", result.access);
        localStorage.setItem("refresh", result.refresh);
        
        // Immediately fetch the profile to hydrate AuthContext
        try {
            const profileRes = await fetch(`${BASE_URL}/profile/`, {
                headers: { "Authorization": `Bearer ${result.access}` }
            });
            const profile = await profileRes.json();
            localStorage.setItem("user", JSON.stringify(profile));
            result.user = profile;
        } catch (e) {
            console.error("Failed to fetch profile during login", e);
        }
    }

    return result;
};

export const getProfile = async () => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/profile/`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
};

export const getJobs = async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
    });
    const res = await fetch(`${BASE_URL}/jobs/?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
};

export const getJobById = async (id) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch job");
    return res.json();
};

export const getApplications = async () => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/applications/`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
};

export const updateProfile = async (data) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/profile/`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const uploadResume = async (file) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    
    const formData = new FormData();
    formData.append("resume", file);
    
    const res = await fetch(`${BASE_URL}/profile/resume/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });
    return res.json();
};

export const applyForJob = async (jobId, data = {}) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const getCompanyJobs = async () => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/jobs/mine/`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
};

export const createJob = async (data) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/jobs/create/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const updateJob = async (jobId, data) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/manage/`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const deleteJob = async (jobId) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    await fetch(`${BASE_URL}/jobs/${jobId}/manage/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
};

export const getJobApplicants = async (jobId) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/applicants/`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
};

export const updateApplicationStatus = async (appId, status) => {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");
    const res = await fetch(`${BASE_URL}/applications/${appId}/`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    if (!res.ok) {
        const err = await res.text();
        console.error("Status update error:", err);
        throw new Error(err);
    }
    return res.json();
};