import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import axiosInstance from '../services/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setupAxiosInterceptors = (token) => {
        // Remover interceptores anteriores si existen
        axiosInstance.interceptors.response.eject(axiosInstance.interceptors.response.handlers[0]);

        // Configurar interceptor para renovar token cuando expire
        axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = authService.getRefreshToken();
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }
                        
                        const response = await axiosInstance.post('/users/token/refresh/', {
                            refresh: refreshToken
                        });
                        
                        const { access: newToken } = response.data;
                        // Actualizar token en localStorage y axiosInstance
                        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        
                        // Actualizar el header de la petición original
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError);
                        await authService.logout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = authService.getToken();
                const userData = authService.getUser();

                if (token && userData) {
                    // Configurar token en axiosInstance
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setupAxiosInterceptors(token);
                    setUser(userData);
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
            // Merge local cart with backend after successful login
            console.log('Calling mergeLocalCartWithBackend...');
            await cartService.mergeLocalCartWithBackend();
            console.log('mergeLocalCartWithBackend called successfully.');
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