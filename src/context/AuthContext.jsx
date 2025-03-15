import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = authService.getUser();
                    if (userData) {
                        setUser(userData);
                        // Configurar el token en axiosInstance
                        const token = authService.getToken();
                        if (token) {
                            authService.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        }
                    } else {
                        // Si no hay datos de usuario, limpiar la autenticación
                        await authService.logout();
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                await authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('Login attempt in AuthContext');
            const userData = await authService.login(credentials);
            console.log('Login successful, user data:', userData);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, error: 'Error al cerrar sesión' };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: authService.isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export { useAuth }; 