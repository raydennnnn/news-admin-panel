// In dev: VITE_API_BASE_URL is empty — Vite proxy handles /api
// In production: VITE_API_BASE_URL = https://newsapi.dextora.org/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get the stored access token from localStorage.
 */
export const getAccessToken = () => localStorage.getItem('accessToken');

/**
 * Get the stored refresh token from localStorage.
 */
export const getRefreshToken = () => localStorage.getItem('refreshToken');

/**
 * Store tokens in localStorage.
 */
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Clear tokens from localStorage.
 */
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('adminUser');
};

/**
 * Core fetch wrapper with auth headers and error handling.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, clear tokens and redirect to login
  if (response.status === 401) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
};

/**
 * Admin login
 */
export const adminLogin = async (email, password) => {
  const data = await apiFetch('/users/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.success && data.data) {
    setTokens(data.data.accessToken, data.data.refreshToken);
    localStorage.setItem('adminUser', JSON.stringify(data.data.user));
  }

  return data;
};

/**
 * Logout — clear all stored auth data
 */
export const logout = () => {
  clearTokens();
  window.location.href = '/login';
};

export default apiFetch;
