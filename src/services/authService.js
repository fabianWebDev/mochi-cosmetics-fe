import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';

export const authService = {
    async login(credentials) {
        try {
            console.log('Attempting login with:', credentials);
            const response = await axiosInstance.post('/users/login/', credentials);
            console.log('Login response:', response.data);
            
            // Verificar la estructura de la respuesta
            if (!response.data) {
                throw new Error('No response data from server');
            }

            // Extraer tokens y datos del usuario
            const { access, refresh, user } = response.data;

            if (!access || !refresh) {
                console.error('Missing tokens in response:', response.data);
                throw new Error('Invalid response structure from server');
            }
            
            // Guardar tokens y datos del usuario
            localStorage.setItem(STORAGE_KEYS.TOKEN, access);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            
            // Configurar el token de acceso en axiosInstance
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
            return user;
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            }
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await axiosInstance.post('/users/register/', userData);
            console.log('Register response:', response.data);

            const { access, refresh, user } = response.data;

            if (!access || !refresh) {
                throw new Error('Invalid response structure from server');
            }
            
            // Guardar tokens y datos del usuario
            localStorage.setItem(STORAGE_KEYS.TOKEN, access);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            
            // Configurar el token de acceso en axiosInstance
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
            return user;
        } catch (error) {
            if (error.response?.status === 400) {
                throw new Error('Datos de registro inválidos');
            }
            throw error;
        }
    },

    async logout() {
        try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                await axiosInstance.post('/users/logout/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Limpiar datos de autenticación
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            // Limpiar el header de autorización
            delete axiosInstance.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
    },

    async getCurrentUser() {
        try {
            const response = await axiosInstance.get('/users/me/');
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Si no está autenticado, limpiar datos y redirigir
                this.logout();
            }
            throw error;
        }
    },

    isAuthenticated() {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        return !!token;
    },

    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    getRefreshToken() {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    getUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    }
}; 