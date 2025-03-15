import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getToken, removeToken, removeUser } from '../utils';
import { ApiError, errorHandler } from '../utils/errorHandler';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Importante para manejar cookies si es necesario
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
  (response) => {
    // Log de la respuesta para depuración
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const { status, data } = error.response;
      
      // Crear un error de API con la información disponible
      const apiError = new ApiError(
        data.message || data.error || 'Error en la petición',
        status,
        data.code,
        data.details
      );
      
      const handledError = errorHandler.handle(apiError);
      
      // Manejar casos especiales
      if (handledError.type === 'auth') {
        removeToken();
        removeUser();
        window.location.href = '/login';
      }
      
      // Emitir evento para notificar a los componentes
      window.dispatchEvent(new CustomEvent('apiError', {
        detail: handledError
      }));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 