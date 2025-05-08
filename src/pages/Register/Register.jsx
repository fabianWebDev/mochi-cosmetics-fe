import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useForm from '../../hooks/useForm';
import { Auth } from '../../components';
import { API_BASE_URL } from '../../constants';
const { RegisterForm } = Auth;

const Register = () => {
    const navigate = useNavigate();
    const { formData, setFormData, error, setError, handleChange } = useForm({
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/users/register/`, formData);

            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            navigate('/login');
        } catch (err) {
            if (err.response?.data) {
                const backendErrors = Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                setError(backendErrors);
            } else {
                setError('Error al registrar usuario');
            }
        }
    };

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3 smooth-col p-0">
                <RegisterForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </div>
        </div>
    );
};

export default Register;
