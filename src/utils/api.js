import axios from 'axios';

// Determine API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers = [];

// Helper to add subscribers waiting for new token
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Helper to notify all subscribers with new token
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = localStorage.getItem('token');
      if (!token) {
        // No token to refresh, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Attempt to refresh token
          const response = await axios.post(`${API_URL}/api/auth/refresh`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          
          // Update original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Notify all waiting requests
          onRefreshed(newToken);
          isRefreshing = false;

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          isRefreshing = false;
          refreshSubscribers = [];
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // If already refreshing, queue this request
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
