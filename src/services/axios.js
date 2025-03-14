import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getToken, removeToken, removeUser } from '../utils';
import { ApiError, errorHandler } from '../utils/errorHandler';

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
      const { status, data } = error.response;
      const apiError = new ApiError(
        data.message || 'Error en la petición',
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