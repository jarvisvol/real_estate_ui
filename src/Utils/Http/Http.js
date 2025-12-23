import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // You can modify response data here
    return response;
  },
  (error) => {
    // Handle specific error status codes
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login
    }
    
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access denied:', error.response.data);
    }
    
    // Return error for component-level handling
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
};

export const authApi = api;
export default api;