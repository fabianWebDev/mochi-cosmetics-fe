/**
 * Axios instance configuration for making HTTP requests to the API
 * This file sets up a custom axios instance with interceptors for handling authentication
 * and token refresh logic
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// Create a custom axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Base URL for all requests
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
  withCredentials: true // Enable sending cookies in cross-origin requests
});

/**
 * Request Interceptor
 * Automatically adds the authentication token to all outgoing requests
 * if a token exists in localStorage
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles token refresh logic when a 401 (Unauthorized) response is received
 * Implements automatic token refresh and retry mechanism
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Make request to refresh the token
        const response = await axiosInstance.post('/users/token/refresh/', {
          refresh: refreshToken
        });

        // Update the token in localStorage and axios headers
        const { access: newToken } = response.data;
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear all auth data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        delete axiosInstance.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;