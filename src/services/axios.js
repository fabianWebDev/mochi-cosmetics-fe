import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getToken, removeToken, removeUser } from '../utils';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          removeToken();
          removeUser();
          window.location.href = '/login';
          break;
        case 403:
          // Acceso denegado
          console.error('Acceso denegado');
          break;
        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado');
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          break;
        default:
          console.error('Error en la petición');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 