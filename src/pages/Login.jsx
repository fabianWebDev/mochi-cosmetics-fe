import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/login/LoginForm';
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, error, loading } = useLogin();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2>Login</h2>
                <LoginForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default Login;