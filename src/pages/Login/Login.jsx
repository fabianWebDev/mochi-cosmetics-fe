import { useLogin } from '../../hooks/useLogin';
import { Auth } from '../../components';
const { LoginForm } = Auth;
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
        <div className="row justify-content-center mt-3">
            <div className="col-10 col-md-8 col-lg-8 col-xl-5">
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