import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import classes from './PasswordResetConfirm.module.css';
import { API_BASE_URL } from '../../../constants';
import Button from '../../ui/common/Button';
import Input from '../../ui/common/Input';
import { Link } from 'react-router-dom';

const PasswordResetConfirm = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');

        if (!tokenParam || !emailParam) {
            toast.error('Invalid reset link');
            navigate('/login');
            return;
        }

        setToken(tokenParam);
        setEmail(emailParam);
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/users/password-reset-confirm/`, {
                email,
                token,
                new_password: formData.password
            });
            toast.success('Password has been reset successfully');
            navigate('/login');
        } catch (error) {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${classes.reset_form}`}>
            <h1 className="custom_h1 mb-3">Reset Password</h1>
            {error && <div className={classes.error_message}>{error}</div>}
            <Input
                label=""
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="New Password"
                className={classes.input_field}
            />
            <Input
                label=""
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Confirm New Password"
                className={classes.input_field}
            />
            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <div className="text-center">
                <Link to="/login" className="custom_p">Back to Login</Link>
            </div>
        </form>
    );
};

export default PasswordResetConfirm; 