import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('momenza_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('momenza_token');
        localStorage.removeItem('momenza_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
