import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario autenticado al cargar la aplicación
        const userDataString = localStorage.getItem('userData');
        const accessToken = localStorage.getItem('accessToken');
        
        if (userDataString && accessToken) {
            const userData = JSON.parse(userDataString);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
                email,
                password
            });

            const { access, refresh, user } = response.data;

            // Guardar datos en localStorage
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userData', JSON.stringify(user));

            // Configurar header de axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Actualizar estado
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error al iniciar sesión'
            };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const accessToken = localStorage.getItem('accessToken');

            if (refreshToken && accessToken) {
                await axios.post('http://127.0.0.1:8000/api/users/logout/', {
                    refresh: refreshToken
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }

            // Limpiar localStorage
            localStorage.removeItem('userData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // Limpiar header de axios
            delete axios.defaults.headers.common['Authorization'];

            // Actualizar estado
            setUser(null);

            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            // Limpiar todo incluso si hay error
            localStorage.removeItem('userData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            return { success: true };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}; 