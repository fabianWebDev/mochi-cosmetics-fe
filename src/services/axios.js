/**
 * Axios Instance Configuration
 * 
 * This module configures a custom axios instance with interceptors for handling
 * authentication, token refresh, and error management. It provides centralized
 * HTTP request handling with automatic token management and user-friendly error messages.
 * 
 * @module axiosInstance
 * @requires axios - HTTP client library
 * @requires API_BASE_URL - Base URL for API endpoints
 * @requires STORAGE_KEYS - Constants for localStorage keys
 * @requires react-toastify - For user notifications
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { toast } from 'react-toastify';

/**
 * Custom axios instance with default configuration
 * 
 * @type {import('axios').AxiosInstance}
 * @property {string} baseURL - Base URL for all API requests
 * @property {Object} headers - Default headers for all requests
 * @property {boolean} crossDomain - Enable cross-domain requests
 * @property {number} timeout - Request timeout in milliseconds (10 seconds)
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  crossDomain: true,
  timeout: 10000, // 10 seconds timeout
});

/**
 * List of public endpoints that don't require authentication
 * These endpoints can be accessed without a valid JWT token
 * 
 * @type {string[]}
 * @constant
 */
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
 * 
 * Automatically adds the authentication token to all outgoing requests
 * if a token exists in localStorage and the endpoint is not public.
 * This ensures that authenticated requests include the necessary authorization header.
 * 
 * @param {import('axios').AxiosRequestConfig} config - The request configuration
 * @returns {import('axios').AxiosRequestConfig} The modified request configuration
 * @throws {Error} If there's an error in the interceptor
 * 
 * @example
 * // This interceptor runs before every request
 * // It automatically adds: Authorization: Bearer <token>
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the current endpoint is in the public endpoints list
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url.endsWith(endpoint)
    );

    // Only add authentication token for non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        // Add Bearer token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Log and reject any errors that occur during request processing
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles automatic token refresh when a 401 (Unauthorized) response is received.
 * Implements a retry mechanism that attempts to refresh the token and retry the
 * original request. If token refresh fails, it clears authentication data and
 * redirects the user to the login page.
 * 
 * @param {import('axios').AxiosResponse} response - The successful response
 * @param {import('axios').AxiosError} error - The error response
 * @returns {Promise<import('axios').AxiosResponse>} The response or retried request
 * @throws {Error} If token refresh fails or other errors occur
 * 
 * @example
 * // This interceptor runs after every response
 * // It handles 401 errors by attempting token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Check if this is a public endpoint that doesn't require authentication
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
        originalRequest.url.endsWith(endpoint)
      );

      // If it's a public endpoint, just reject the error without attempting refresh
      if (isPublicEndpoint) {
        return Promise.reject(error);
      }

      // Prevent infinite retry loops by checking if this is already a retry attempt
      if (originalRequest._retry) {
        // Clear all authentication data from localStorage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Remove authorization header from axios defaults
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // Notify user and redirect to login page
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Make request to refresh the access token
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
          refresh: refreshToken
        });

        // Extract new access token from response
        const { access: newToken } = response.data;
        
        // Update token in localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        
        // Update authorization header in axios defaults
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Update authorization header in the original request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear all authentication data
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Remove authorization header from axios defaults
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // Notify user and redirect to login page
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle other API errors with custom error messages
    if (error.response?.data?.detail) {
      // Display server-provided error message
      toast.error(error.response.data.detail);
    } else if (error.message) {
      // Display generic error message if no server message available
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Default export of the configured axios instance
 * 
 * @exports axiosInstance
 * @type {import('axios').AxiosInstance}
 */
export default axiosInstance;