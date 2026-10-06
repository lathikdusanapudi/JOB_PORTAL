const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('xxxx') && !envUrl.startsWith('/')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://job-portal-backend.onrender.com/api';
};

const BASE_URL = getApiUrl();


// Save tokens
export const saveTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

// Get auth header
export const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

// Register
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Login
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.access) saveTokens(result.access, result.refresh);
  return result;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};