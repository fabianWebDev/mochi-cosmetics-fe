/**
 * Login Hook
 * 
 * This hook provides a React-friendly interface for handling user login functionality.
 * It manages login state, error handling, and navigation after successful authentication.
 * It also handles cart synchronization with the backend after login.
 * 
 * Key Features:
 * - Login form submission handling
 * - Loading state management
 * - Error handling and display
 * - Cart synchronization after login
 * - Navigation with redirect support
 * - Toast notifications for user feedback
 * 
 * @module useLogin
 * @requires react - React hooks for state management
 * @requires react-router-dom - Navigation functionality
 * @requires react-toastify - Toast notifications
 * @requires authService - Authentication service for API calls
 * @requires cartService - Cart service for backend synchronization
 * 
 * @example
 * import { useLogin } from '../hooks/useLogin';
 * 
 * function LoginComponent() {
 *   const { login, error, loading } = useLogin();
 * 
 *   const handleSubmit = (formData) => {
 *     login(formData);
 *   };
 * 
 *   if (loading) return <div>Logging in...</div>;
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div className="error">{error}</div>}
 *       {/* form fields */}
 *     </form>
 *   );
 * }
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';

/**
 * Custom hook for handling user login
 * 
 * This hook provides a reactive interface for login functionality, managing
 * the login process including form submission, error handling, cart synchronization,
 * and navigation after successful authentication. It supports redirect functionality
 * to return users to their intended destination after login.
 * 
 * @returns {Object} Login state and methods
 * @returns {Function} returns.login - Function to handle login form submission
 * @returns {string} returns.error - Current error message, empty string if no error
 * @returns {boolean} returns.loading - Whether login is currently in progress
 * 
 * @example
 * const { login, error, loading } = useLogin();
 * 
 * // Handle login form submission
 * const handleLogin = async (formData) => {
 *   await login(formData);
 * };
 * 
 * // Check loading state
 * if (loading) {
 *   return <div>Logging in...</div>;
 * }
 * 
 * // Display error message
 * if (error) {
 *   return <div className="error">{error}</div>;
 * }
 */
export const useLogin = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handles user login process
     * 
     * This function processes the login form data, authenticates the user
     * through the authService, synchronizes the local cart with the backend,
     * and navigates to the appropriate page after successful login. It handles
     * errors gracefully and provides user feedback through toast notifications.
     * 
     * @async
     * @param {Object} formData - Login form data containing credentials
     * @param {string} formData.email - User's email address
     * @param {string} formData.password - User's password
     * @returns {Promise<void>}
     * 
     * @example
     * const { login } = useLogin();
     * 
     * // Login with form data
     * const formData = {
     *   email: 'user@example.com',
     *   password: 'password123'
     * };
     * await login(formData);
     */
    const login = async (formData) => {
        setError('');
        setLoading(true);

        try {
            // Authenticate user with provided credentials
            await authService.login(formData);
            
            // Synchronize local cart with backend after successful login
            await cartService.mergeLocalCartWithBackend();
            
            // Show success notification
            toast.dismiss();
            toast.success('Successfully logged in!');
            
            // Navigate to intended destination or default to products page
            const from = location.state?.from?.pathname || '/products';
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            
            // Show error notification and update error state
            toast.dismiss();
            toast.error(err.message || 'Error logging in. Please try again.');
            setError(err.message || 'Error logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { login, error, loading };
};
