/**
 * Authentication Hook
 * 
 * This hook provides a React-friendly interface for managing user authentication state.
 * It wraps the authService and provides reactive state management with automatic
 * synchronization across browser tabs and real-time state updates.
 * 
 * Key Features:
 * - Reactive authentication state management
 * - Cross-tab authentication state synchronization
 * - Real-time state monitoring with polling
 * - Login and logout functionality
 * - User data access
 * - Token management
 * 
 * @module useAuth
 * @requires react - React hooks for state management
 * @requires authService - Authentication service for API calls and storage
 * 
 * @example
 * import useAuth from '../hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { isAuthenticated, user, login, logout } = useAuth();
 * 
 *   if (isAuthenticated) {
 *     return <div>Welcome, {user.email}!</div>;
 *   }
 *   
 *   return <button onClick={() => login(token, refresh, user)}>Login</button>;
 * }
 */

import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

/**
 * Custom hook for managing authentication state
 * 
 * This hook provides a reactive interface to the authentication system,
 * automatically updating when authentication state changes in the current
 * tab or other browser tabs. It includes methods for login, logout,
 * and accessing user data and tokens.
 * 
 * @returns {Object} Authentication state and methods
 * @returns {boolean} returns.isAuthenticated - Whether the user is currently authenticated
 * @returns {Object|null} returns.user - Current user object or null if not authenticated
 * @returns {Function} returns.login - Function to log in a user
 * @returns {Function} returns.logout - Function to log out the current user
 * @returns {Function} returns.getUser - Function to get the current user object
 * @returns {Function} returns.getToken - Function to get the current access token
 * 
 * @example
 * const { isAuthenticated, user, login, logout, getUser, getToken } = useAuth();
 * 
 * // Check authentication status
 * if (isAuthenticated) {
 *   console.log('User is logged in:', user.email);
 * }
 * 
 * // Login a user
 * const handleLogin = async (credentials) => {
 *   try {
 *     const user = await authService.login(credentials);
 *     login(user.access, user.refresh, user);
 *   } catch (error) {
 *     console.error('Login failed:', error);
 *   }
 * };
 * 
 * // Logout current user
 * const handleLogout = () => {
 *   logout();
 * };
 */
export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState(authService.getUser());

    useEffect(() => {
        /**
         * Handles authentication state changes from storage events
         * 
         * This function is called when authentication data changes in other browser tabs,
         * ensuring the current tab stays synchronized with the authentication state.
         */
        const handleStorageChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            setUser(authService.getUser());
        };

        // Listen for storage events from other tabs
        window.addEventListener('storage', handleStorageChange);
        
        /**
         * Polling mechanism to detect authentication state changes
         * 
         * This interval checks for authentication state changes every second,
         * ensuring the hook state stays synchronized with the actual auth state
         * even when changes happen outside of React's normal update cycle.
         */
        const interval = setInterval(() => {
            const currentAuth = authService.isAuthenticated();
            const currentUser = authService.getUser();
            if (currentAuth !== isAuthenticated || JSON.stringify(currentUser) !== JSON.stringify(user)) {
                setIsAuthenticated(currentAuth);
                setUser(currentUser);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isAuthenticated, user]);

    /**
     * Logs in a user and updates the authentication state
     * 
     * This function stores the authentication data using the authService
     * and updates the hook's internal state to reflect the new authentication status.
     * 
     * @param {string} token - JWT access token
     * @param {string} refresh - JWT refresh token
     * @param {Object} user - User object containing user information
     * 
     * @example
     * const { login } = useAuth();
     * 
     * // After successful API login
     * login(accessToken, refreshToken, userData);
     */
    const login = (token, refresh, user) => {
        authService.setAuthData(token, refresh, user);
        setIsAuthenticated(true);
        setUser(user);
    };

    /**
     * Logs out the current user and clears authentication state
     * 
     * This function calls the authService logout method to clear server-side
     * authentication and updates the hook's internal state to reflect the logout.
     * 
     * @async
     * @returns {Promise<void>}
     * 
     * @example
     * const { logout } = useAuth();
     * 
     * // Logout current user
     * await logout();
     */
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return { 
        isAuthenticated, 
        login, 
        logout,
        getUser: () => user,
        getToken: authService.getToken
    };
}
