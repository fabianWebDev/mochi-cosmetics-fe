import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/users/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password2: formData.password2,
                first_name: formData.first_name,
                last_name: formData.last_name
            });

            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
            if (err.response?.data) {
                // Si hay errores específicos del backend, mostrarlos
                const backendErrors = Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                setError(backendErrors);
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h2>Crear nueva cuenta</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="first_name">Nombre</label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            required
                            placeholder="Nombre"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Apellido</label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            required
                            placeholder="Apellido"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Confirmar Contraseña</label>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            required
                            placeholder="Confirmar Contraseña"
                            value={formData.password2}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
