import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../constants';
import classes from './PasswordResetRequest.module.css';
import Button from '../../ui/common/Button';
import { Link } from 'react-router-dom';
import Input from '../../ui/common/Input';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/users/password-reset-request/`, { email });
      toast.success('Password reset link has been sent to your email');
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${classes.password_reset_form}`}>
      <h1 className="custom_h1 mb-3">Reset Password</h1>
      <p className="mb-2 custom_p">Enter your email address and a password reset link will be sent to you.</p>
      <Input
        label=""
        type="email"
        id="email"
        name="email"
        required
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <div className="text-center">
        <Link to="/login" className="text_small">Back to Login</Link>
      </div>
    </form>
  );
};

export default PasswordResetRequest; 