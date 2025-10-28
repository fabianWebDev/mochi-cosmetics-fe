/**
 * User Profile Form Hook
 * 
 * This hook provides a React-friendly interface for managing user profile form state
 * and submission. It handles form field changes, validation, API communication,
 * and state management for profile editing functionality.
 * 
 * Key Features:
 * - Form field change handling
 * - Password matching validation
 * - Profile update API integration
 * - Authentication verification
 * - Edit mode state management
 * - Success and error message handling
 * - Session expiration handling
 * 
 * @module useProfileForm
 * @requires react - React hooks for state management
 * @requires react-router-dom - Navigation functionality
 * @requires authService - Authentication service for user verification
 * @requires API_BASE_URL - API base URL constant
 * 
 * @example
 * import { useProfileForm } from '../hooks/useProfileForm';
 * 
 * function ProfileEditForm({ profileData, setProfileData }) {
 *   const { 
 *     error, 
 *     success, 
 *     isEditing, 
 *     handleChange, 
 *     handleSubmit,
 *     handleEditClick,
 *     handleCancelClick
 *   } = useProfileForm(profileData, setProfileData);
 * 
 *   if (error) return <div>Error: {error}</div>;
 *   if (success) return <div>Success: {success}</div>;
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" value={profileData.email} onChange={handleChange} />
 *       <button type="submit">Save</button>
 *       <button onClick={handleCancelClick}>Cancel</button>
 *     </form>
 *   );
 * }
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../constants';

/**
 * Custom hook for managing user profile form state and submission
 * 
 * This hook provides form handling functionality for profile editing, including
 * state management for edit mode, field changes, form submission, and error/success
 * messages. It handles authentication verification, password validation, and API
 * communication for updating user profile data.
 * 
 * @param {Object} profileData - Current profile data object
 * @param {string} profileData.email - User's email address
 * @param {string} profileData.first_name - User's first name
 * @param {string} profileData.last_name - User's last name
 * @param {string} profileData.password - User's password (for updates)
 * @param {string} profileData.password2 - Password confirmation (for validation)
 * @param {Function} setProfileData - Function to update profile data state
 * 
 * @returns {Object} Profile form state and handlers
 * @returns {string|null} returns.error - Error message if update failed, null otherwise
 * @returns {string|null} returns.success - Success message if update succeeded, null otherwise
 * @returns {boolean} returns.isEditing - Whether the form is in edit mode
 * @returns {Function} returns.handleChange - Function to handle form field changes
 * @returns {Function} returns.handleSubmit - Function to handle form submission
 * @returns {Function} returns.handleEditClick - Function to enable edit mode
 * @returns {Function} returns.handleCancelClick - Function to disable edit mode
 * 
 * @example
 * const { error, success, isEditing, handleChange, handleSubmit } = useProfileForm(profileData, setProfileData);
 * 
 * // Handle form field changes
 * <input name="email" value={profileData.email} onChange={handleChange} />
 * 
 * // Submit form
 * <form onSubmit={handleSubmit}>
 *   <button type="submit">Save Changes</button>
 * </form>
 * 
 * // Toggle edit mode
 * {isEditing ? (
 *   <button onClick={handleCancelClick}>Cancel</button>
 * ) : (
 *   <button onClick={handleEditClick}>Edit Profile</button>
 * )}
 */
export const useProfileForm = (profileData, setProfileData) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    /**
     * Handles form field changes and updates profile data state
     * 
     * This function processes changes to form input fields and updates the
     * corresponding profile data state. It extracts the field name and value
     * from the event target and updates the profile data object accordingly.
     * 
     * @param {Event} e - Form input change event
     * @returns {void}
     * 
     * @example
     * const { handleChange } = useProfileForm(profileData, setProfileData);
     * 
     * // Use in input field
     * <input 
     *   name="email" 
     *   value={profileData.email} 
     *   onChange={handleChange} 
     * />
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handles form submission and profile update
     * 
     * This async function processes the profile form submission, validates password
     * matching, verifies authentication status, and submits the updated profile data
     * to the backend API. It handles errors, session expiration, and provides user
     * feedback through success and error messages.
     * 
     * @async
     * @param {Event} e - Form submission event
     * @returns {Promise<void>}
     * 
     * @example
     * const { handleSubmit } = useProfileForm(profileData, setProfileData);
     * 
     * // Use in form
     * <form onSubmit={handleSubmit}>
     *   <input name="email" value={profileData.email} onChange={handleChange} />
     *   <button type="submit">Save Changes</button>
     * </form>
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (profileData.password || profileData.password2) {
            if (profileData.password !== profileData.password2) {
                setError('Passwords do not match');
                return;
            }
        }

        try {
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }

            const token = authService.getToken();
            if (!token) {
                authService.logout();
                navigate('/login');
                return;
            }

            const updateData = {};
            if (profileData.email) updateData.email = profileData.email;
            if (profileData.first_name) updateData.first_name = profileData.first_name;
            if (profileData.last_name) updateData.last_name = profileData.last_name;
            if (profileData.password) updateData.password = profileData.password;
            if (profileData.password2) updateData.password2 = profileData.password2;

            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                if (errorData.email) {
                    throw new Error(`Email: ${errorData.email[0]}`);
                } else if (errorData.first_name) {
                    throw new Error(`First Name: ${errorData.first_name[0]}`);
                } else if (errorData.last_name) {
                    throw new Error(`Last Name: ${errorData.last_name[0]}`);
                } else if (errorData.password) {
                    throw new Error(`Password: ${errorData.password[0]}`);
                } else {
                    throw new Error('Error updating profile');
                }
            }

            const data = await response.json();
            setProfileData(prev => ({
                ...prev,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: '',
                password2: ''
            }));
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
            console.error('Profile update error:', err);
        }
    };

    /**
     * Enables edit mode for the profile form
     * 
     * This function activates edit mode, allowing users to modify their profile
     * data. It clears any existing error or success messages before enabling
     * edit mode.
     * 
     * @returns {void}
     * 
     * @example
     * const { handleEditClick, isEditing } = useProfileForm(profileData, setProfileData);
     * 
     * // Enable edit mode
     * <button onClick={handleEditClick} disabled={isEditing}>
     *   Edit Profile
     * </button>
     */
    const handleEditClick = () => {
        setError(null);
        setSuccess(null);
        setIsEditing(true);
    };

    /**
     * Disables edit mode for the profile form
     * 
     * This function deactivates edit mode, allowing users to cancel profile editing.
     * It clears any existing error or success messages before disabling edit mode.
     * 
     * @returns {void}
     * 
     * @example
     * const { handleCancelClick, isEditing } = useProfileForm(profileData, setProfileData);
     * 
     * // Cancel edit mode
     * {isEditing && (
     *   <button onClick={handleCancelClick}>
     *     Cancel
     *   </button>
     * )}
     */
    const handleCancelClick = () => {
        setError(null);
        setSuccess(null);
        setIsEditing(false);
    };

    return {
        error,
        success,
        isEditing,
        handleChange,
        handleSubmit,
        handleEditClick,
        handleCancelClick
    };
}; 