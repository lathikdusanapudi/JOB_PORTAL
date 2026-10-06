const BASE_URL = "https://job-portal-backend-db2g.onrender.com/api";


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