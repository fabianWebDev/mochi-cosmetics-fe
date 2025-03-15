import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';

export const authService = {
    async login(credentials) {
        try {
            const response = await axiosInstance.post('/users/login/', credentials);
            
            if (!response.data) {
                throw new Error('No response data from server');
            }

            const { access, refresh, user } = response.data;

            if (!access || !refresh) {
                throw new Error('Invalid response structure from server');
            }
            
            this.setAuthData(access, refresh, user);
            return user;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            }
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await axiosInstance.post('/users/register/', userData);
            const { access, refresh, user } = response.data;

            if (!access || !refresh) {
                throw new Error('Invalid response structure from server');
            }
            
            this.setAuthData(access, refresh, user);
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
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                await axiosInstance.post('/users/logout/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            this.clearAuthData();
        }
    },

    setAuthData(accessToken, refreshToken, user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    clearAuthData() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
    },

    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
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