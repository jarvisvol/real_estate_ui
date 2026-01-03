import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // Production
  if (hostname === 'ballajiproperty.in' || hostname === 'www.ballajiproperty.in') {
    return 'http://ballajiproperty.in/api/';
  }
  
  // Test/Staging environment (add your test domain here)
  if (hostname === 'test.ballajiproperty.in' || hostname === 'staging.ballajiproperty.in') {
    return 'http://test.ballajiproperty.in/api/';
  }
  
  // Local development
  return 'http://localhost:4000/api/';
};

const API_BASE_URL = getBaseURL();

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