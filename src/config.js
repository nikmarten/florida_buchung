// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Auth Header Configuration
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 