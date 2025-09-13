import { useLogin } from '../../hooks/useLogin';
import { Auth } from '../../components';
const { LoginForm } = Auth;
import { useState } from 'react';
import * as Yup from 'yup';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email must be valid')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
});

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, error, loading } = useLogin();
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});

        try {
            // Validate form data
            await validationSchema.validate(formData, { abortEarly: false });
            login(formData);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                // Handle Yup validation errors
                const errors = {};
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
                setFieldErrors(errors);
            }
        }
    };

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4 col-xxl-3 smooth-col p-0">
                        <LoginForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={error}
                            fieldErrors={fieldErrors}
                        />
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default Login;