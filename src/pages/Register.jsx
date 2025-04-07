import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useForm from '../hooks/useForm';
import FormField from '../components/auth/FormField';
import ErrorMessage from '../components/auth/ErrorMessage';

const Register = () => {
    const navigate = useNavigate();
    const { formData, setFormData, error, setError, handleChange } = useForm({
        username: '',
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
            const response = await axios.post('http://localhost:8000/api/users/register/', formData);

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
        <div className="register-container">
            <div className="register-form-wrapper">
                <h2>Crear nueva cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <ErrorMessage message={error} />
                    
                    <FormField
                        label="Nombre de usuario"
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Nombre de usuario"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    
                    <FormField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    
                    <FormField
                        label="Nombre"
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        placeholder="Nombre"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    
                    <FormField
                        label="Apellido"
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        placeholder="Apellido"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    
                    <FormField
                        label="Contraseña"
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    
                    <FormField
                        label="Confirmar Contraseña"
                        id="password2"
                        name="password2"
                        type="password"
                        required
                        placeholder="Confirmar Contraseña"
                        value={formData.password2}
                        onChange={handleChange}
                    />
                    
                    <button type="submit" className="submit-button">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
