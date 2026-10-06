import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('xxxx') && !envUrl.startsWith('/')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://job-portal-backend.onrender.com/api';
};

const API_URL = getApiUrl();


export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  // ── Extract readable error from Django response ────
  const extractError = (error) => {
    if (!error.response) {
      return 'Cannot connect to server. Make sure the backend is running.';
    }
    const data = error.response.data;
    if (typeof data === 'string') return data;

    // Django REST Framework error formats
    return (
      data?.non_field_errors?.[0] ||
      data?.detail ||
      data?.email?.[0] ||
      data?.password?.[0] ||
      data?.name?.[0] ||
      data?.company_name?.[0] ||
      data?.message ||
      Object.values(data || {})?.[0]?.[0] ||
      Object.values(data || {})?.[0] ||
      'Something went wrong. Please try again.'
    );
  };

  // ── LOGIN ──────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login/`, { email, password });
      const { user, access, refresh } = res.data;
      setUser(user);
      localStorage.setItem('user',          JSON.stringify(user));
      localStorage.setItem('access_token',  access);
      localStorage.setItem('refresh_token', refresh);
      return user;
    } catch (err) {
      throw new Error(extractError(err));
    }
  };

  // ── REGISTER ───────────────────────────────────────
  const register = async (data) => {
    try {
      const payload = {
        name:         data.name.trim(),
        email:        data.email.trim(),
        password:     data.password,
        role:         data.role || 'applicant',
        company_name: data.company_name || '',
      };
      const res = await axios.post(`${API_URL}/register/`, payload);
      const { user, access, refresh } = res.data;
      setUser(user);
      localStorage.setItem('user',          JSON.stringify(user));
      localStorage.setItem('access_token',  access);
      localStorage.setItem('refresh_token', refresh);
      return user;
    } catch (err) {
      throw new Error(extractError(err));
    }
  };

  // ── LOGOUT ─────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const isCompany   = user?.role === 'company';
  const isApplicant = user?.role === 'applicant';
  const isAdmin     = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      isCompany, isApplicant, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};