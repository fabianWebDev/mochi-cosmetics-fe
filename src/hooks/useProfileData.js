/**
 * User Profile Data Hook
 * 
 * This hook provides a React-friendly interface for fetching and managing user profile data.
 * It handles authentication verification, profile data retrieval, and automatic navigation
 * based on authentication status. The hook is designed for use in profile editing forms.
 * 
 * Key Features:
 * - Authentication verification before data fetching
 * - Automatic profile data loading on mount
 * - User data state management
 * - Loading and error state handling
 * - Session expiration handling
 * - Automatic redirect to login for unauthenticated users
 * 
 * @module useProfileData
 * @requires react - React hooks for state management and effects
 * @requires react-router-dom - Navigation functionality
 * @requires authService - Authentication service for user verification
 * @requires API_BASE_URL - API base URL constant
 * 
 * @example
 * import { useProfileData } from '../hooks/useProfileData';
 * 
 * function ProfileEditPage() {
 *   const { profileData, setProfileData, isLoading, error, fetchUserData } = useProfileData();
 * 
 *   if (isLoading) return <div>Loading profile...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <form>
 *       <input
 *         name="email"
 *         value={profileData.email}
 *         onChange={(e) => setProfileData({...profileData, email: e.target.value})}
 *       />
 *       <input
 *         name="first_name"
 *         value={profileData.first_name}
 *         onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
 *       />
 *       <input
 *         name="last_name"
 *         value={profileData.last_name}
 *         onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
 *       />
 *       <button type="submit">Save Profile</button>
 *     </form>
 *   );
 * }
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../constants';

/**
 * Custom hook for fetching and managing user profile data
 * 
 * This hook provides a reactive interface for profile data management, automatically
 * fetching user profile information from the backend API on mount. It handles
 * authentication verification, loading states, error management, and provides
 * profile data for use in form components.
 * 
 * @returns {Object} Profile state and data
 * @returns {Object} returns.profileData - User profile data object
 * @returns {string} returns.profileData.email - User's email address
 * @returns {string} returns.profileData.first_name - User's first name
 * @returns {string} returns.profileData.last_name - User's last name
 * @returns {string} returns.profileData.password - User's password (empty initially)
 * @returns {string} returns.profileData.password2 - Password confirmation (empty initially)
 * @returns {Function} returns.setProfileData - Function to update profile data state
 * @returns {boolean} returns.isLoading - Whether profile data is currently being fetched
 * @returns {string|null} returns.error - Error message if fetch failed, null if no error
 * @returns {Function} returns.fetchUserData - Function to manually refetch profile data
 * 
 * @example
 * const { profileData, setProfileData, isLoading, error, fetchUserData } = useProfileData();
 * 
 * // Check if profile is loading
 * if (isLoading) {
 *   return <div>Loading profile...</div>;
 * }
 * 
 * // Handle error state
 * if (error) {
 *   return <div>Error loading profile: {error}</div>;
 * }
 * 
 * // Update profile data
 * const handleNameChange = (e) => {
 *   setProfileData({ ...profileData, first_name: e.target.value });
 * };
 * 
 * // Manually refetch data
 * const handleRefresh = () => {
 *   fetchUserData();
 * };
 */
export const useProfileData = () => {
    const navigate = useNavigate();
    
    // User profile data state
    const [profileData, setProfileData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    
    // Loading state to indicate when profile data is being fetched
    const [isLoading, setIsLoading] = useState(true);
    
    // Error message if profile fetching fails
    const [error, setError] = useState(null);

    /**
     * Fetches user profile data from the API
     * 
     * This async function handles the complete flow of fetching user profile data,
     * including authentication verification, token validation, API call, and state
     * updates. It automatically handles session expiration and redirects unauthenticated
     * users to the login page.
     * 
     * @async
     * @function fetchUserData
     * @returns {Promise<void>}
     * 
     * @example
     * const { fetchUserData } = useProfileData();
     * 
     * // Manually refetch profile data
     * const refreshProfile = async () => {
     *   await fetchUserData();
     * };
     */
    const fetchUserData = async () => {
        try {
            // Verify user is authenticated before attempting to fetch data
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }

            // Get authentication token
            const token = authService.getToken();
            if (!token) {
                // If no token, logout and redirect to login
                authService.logout();
                navigate('/login');
                return;
            }

            // Fetch profile data from API with authentication token
            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle session expiration (401 Unauthorized)
                if (response.status === 401) {
                    authService.logout();
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch profile data');
            }

            // Parse response data
            const data = await response.json();
            
            // Update profile data with fetched information
            setProfileData(prev => ({
                ...prev,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: '',
                password2: ''
            }));
        } catch (err) {
            // Handle any errors during the fetch process
            setError('Error loading profile data');
        } finally {
            // Always stop loading, regardless of success or failure
            setIsLoading(false);
        }
    };

    /**
     * Effect hook that fetches user profile data on component mount
     * 
     * This effect automatically triggers when the hook is first used,
     * fetching the user's profile data from the backend API. It runs
     * once on mount and whenever the navigation function changes.
     */
    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    // Return hook state and data for component consumption
    return { profileData, setProfileData, isLoading, error, fetchUserData };
}; 