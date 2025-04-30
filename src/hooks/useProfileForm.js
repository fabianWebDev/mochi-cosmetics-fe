import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../constants';

export const useProfileForm = (profileData, setProfileData) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleEditClick = () => {
        setError(null);
        setSuccess(null);
        setIsEditing(true);
    };

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