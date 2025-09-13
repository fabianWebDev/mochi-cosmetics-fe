import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import useForm from '../../hooks/useForm';
import { Auth } from '../../components';
import { API_BASE_URL } from '../../constants';
import { useState } from 'react';
const { RegisterForm } = Auth;
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email must be valid')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    first_name: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .required('First name is required'),
    last_name: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .required('Last name is required')
});

const Register = () => {
    const navigate = useNavigate();
    const { formData, setFormData, error, setError, handleChange } = useForm({
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        try {
            // Validate form data
            await validationSchema.validate(formData, { abortEarly: false });

            const response = await axios.post(`${API_BASE_URL}/users/register/`, formData);

            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            navigate('/login');
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                // Handle Yup validation errors
                const errors = {};
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
                setFieldErrors(errors);
            } else if (err.response?.data) {
                // Handle backend errors
                const backendErrors = Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                setError(backendErrors);
            } else {
                setError('Error registering user');
            }
        }
    };

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4 col-xxl-3 smooth-col p-0">
                        <RegisterForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            error={error}
                            fieldErrors={fieldErrors}
                        />
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default Register;
