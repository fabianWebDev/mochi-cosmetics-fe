/**
 * Axios instance configuration for making HTTP requests to the API
 * This file sets up a custom axios instance with interceptors for handling authentication
 * and token refresh logic
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { toast } from 'react-toastify';

// Create a custom axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Base URL for all requests
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
  crossDomain: true,
  timeout: 10000,
});

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/users/login/',
  '/users/register/',
  '/users/token/refresh/',
  '/products/latest/public/',
  '/categories/public/',
  '/products/public/',
  '/products/'
];

/**
 * Request Interceptor
 * Automatically adds the authentication token to all outgoing requests
 * if a token exists in localStorage and the endpoint is not public
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the endpoint is public
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url.endsWith(endpoint)
    );

    // Only add token for non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
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

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Check if this is a public endpoint
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
        originalRequest.url.endsWith(endpoint)
      );

      // If it's a public endpoint, just reject the error
      if (isPublicEndpoint) {
        return Promise.reject(error);
      }

      // If this is a retry attempt, don't try again
      if (originalRequest._retry) {
        // Clear auth data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // Show error message
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Mark this request as retried
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Make request to refresh the token
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
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
        
        // Show error message
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle other errors
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;