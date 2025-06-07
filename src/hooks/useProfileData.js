import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../constants';

export const useProfileData = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
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

            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch profile data');
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
        } catch (err) {
            setError('Error loading profile data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    return { profileData, setProfileData, isLoading, error, fetchUserData };
}; 