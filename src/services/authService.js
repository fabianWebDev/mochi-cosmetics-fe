/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including login, logout,
 * registration, and token management. It provides a centralized interface for
 * user authentication state and token storage.
 * 
 * Key Features:
 * - User login and logout functionality
 * - User registration with validation
 * - JWT token management and storage
 * - Authentication state checking
 * - Admin role verification
 * - Automatic token refresh handling
 * - Secure data storage in localStorage
 * 
 * @module authService
 * @requires axiosInstance - Configured axios instance for API calls
 * @requires STORAGE_KEYS - Constants for localStorage keys
 * @requires react-toastify - For user notifications
 */

import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';
import { toast } from 'react-toastify';

/**
 * Authentication service object containing all auth-related methods
 * 
 * @type {Object}
 */
export const authService = {
    /**
     * Authenticates a user with provided credentials
     * 
     * @async
     * @param {Object} credentials - User login credentials
     * @param {string} credentials.email - User's email address
     * @param {string} credentials.password - User's password
     * @returns {Promise<Object>} User object on successful authentication
     * @throws {Error} When credentials are invalid or server returns an error
     * 
     * @example
     * try {
     *   const user = await authService.login({ email: 'user@example.com', password: 'password' });
     *   console.log('Logged in user:', user);
     * } catch (error) {
     *   console.error('Login failed:', error.message);
     * }
     */
    async login(credentials) {
        try {
            // Make API call to authenticate user
            const response = await axiosInstance.post('/users/login/', credentials);

            // Validate response data exists
            if (!response.data) {
                throw new Error('No response data from server');
            }

            const { access, refresh, user } = response.data;

            // Validate required tokens are present
            if (!access || !refresh) {
                throw new Error('Invalid response structure from server');
            }

            // Store authentication data in localStorage
            this.setAuthData(access, refresh, user);
            return user;
        } catch (error) {
            // Handle specific authentication errors
            if (error.response?.status === 401) {
                throw new Error('Invalid credentials');
            }
            throw error;
        }
    },

    /**
     * Registers a new user account
     * 
     * @async
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's password
     * @param {string} userData.first_name - User's first name
     * @param {string} userData.last_name - User's last name
     * @returns {Promise<Object>} User object on successful registration
     * @throws {Error} When registration data is invalid or server returns an error
     * 
     * @example
     * try {
     *   const user = await authService.register({
     *     email: 'newuser@example.com',
     *     password: 'securepassword',
     *     first_name: 'John',
     *     last_name: 'Doe'
     *   });
     *   console.log('Registered user:', user);
     * } catch (error) {
     *   console.error('Registration failed:', error.message);
     * }
     */
    async register(userData) {
        try {
            // Make API call to register new user
            const response = await axiosInstance.post('/users/register/', userData);
            const { access, refresh, user } = response.data;

            // Validate required tokens are present
            if (!access || !refresh) {
                throw new Error('Invalid response structure from server');
            }

            // Store authentication data in localStorage
            this.setAuthData(access, refresh, user);
            return user;
        } catch (error) {
            // Handle specific registration errors
            if (error.response?.status === 400) {
                throw new Error('Invalid registration data');
            }
            throw error;
        }
    },

    /**
     * Logs out the current user and clears authentication data
     * 
     * @async
     * @returns {Promise<void>}
     * 
     * @example
     * await authService.logout();
     * // User is now logged out and tokens are cleared
     */
    async logout() {
        try {
            // Get refresh token for server-side logout
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                // Notify server to invalidate refresh token
                await axiosInstance.post('/users/logout/', { refresh: refreshToken });
                toast.dismiss();
                toast.success('Logged out successfully!');
            }
        } catch (error) {
            // Log error but don't throw - ensure auth data is always cleared
            console.error('Error during logout:', error.message);
        } finally {
            // Always clear local authentication data regardless of server response
            this.clearAuthData();
        }
    },

    /**
     * Stores authentication data in localStorage
     * 
     * @param {string} accessToken - JWT access token
     * @param {string} refreshToken - JWT refresh token
     * @param {Object} user - User object containing user information
     * 
     * @example
     * authService.setAuthData('access_token_here', 'refresh_token_here', { id: 1, email: 'user@example.com' });
     */
    setAuthData(accessToken, refreshToken, user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    /**
     * Removes all authentication data from localStorage
     * 
     * @example
     * authService.clearAuthData();
     * // All auth data is now removed from localStorage
     */
    clearAuthData() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    /**
     * Checks if a user is currently authenticated
     * 
     * @returns {boolean} True if user has valid token and user data, false otherwise
     * 
     * @example
     * if (authService.isAuthenticated()) {
     *   console.log('User is logged in');
     * } else {
     *   console.log('User is not logged in');
     * }
     */
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    },

    /**
     * Checks if the current user has admin privileges
     * 
     * @returns {boolean} True if user is admin, false otherwise
     * 
     * @example
     * if (authService.isAdmin()) {
     *   console.log('User has admin privileges');
     * } else {
     *   console.log('User does not have admin privileges');
     * }
     */
    isAdmin() {
        const user = this.getUser();
        return user?.is_admin;
    },

    /**
     * Retrieves the current access token from localStorage
     * 
     * @returns {string|null} Access token if exists, null otherwise
     * 
     * @example
     * const token = authService.getToken();
     * if (token) {
     *   // Use token for authenticated requests
     * }
     */
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Retrieves the current refresh token from localStorage
     * 
     * @returns {string|null} Refresh token if exists, null otherwise
     * 
     * @example
     * const refreshToken = authService.getRefreshToken();
     * if (refreshToken) {
     *   // Use refresh token to get new access token
     * }
     */
    getRefreshToken() {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Retrieves the current user object from localStorage
     * 
     * @returns {Object|null} User object if exists, null otherwise
     * 
     * @example
     * const user = authService.getUser();
     * if (user) {
     *   console.log('Current user:', user.email);
     * }
     */
    getUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    // async refreshTokenIfNeeded() {
    //     const refresh = this.getRefreshToken();
    //     if (!refresh) return null;
    //     try {
    //         const response = await axiosInstance.post('/users/refresh/', { refresh });
    //         const { access } = response.data;
    //         if (access) {
    //             localStorage.setItem(STORAGE_KEYS.TOKEN, access);
    //             return access;
    //         }
    //     } catch (error) {
    //         console.error("Error refreshing token:", error);
    //         this.clearAuthData();
    //     }
    //     return null;
    // }
}; 