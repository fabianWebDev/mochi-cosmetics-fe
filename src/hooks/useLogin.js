import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';

export const useLogin = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const login = async (formData) => {
        setError('');
        setLoading(true);

        try {
            await authService.login(formData);
            await cartService.mergeLocalCartWithBackend();
            toast.dismiss();
            toast.success('Successfully logged in!');
            const from = location.state?.from?.pathname || '/products';
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            toast.dismiss();
            toast.error(err.message || 'Error logging in. Please try again.');
            setError(err.message || 'Error logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { login, error, loading };
};
