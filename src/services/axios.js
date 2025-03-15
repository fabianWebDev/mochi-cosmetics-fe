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
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const { status, config } = error.response;
      
      // Si el error es 401, intentar refrescar el token
      if (status === 401 && !config._retry) {
        config._retry = true;
        try {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          
          // Guardar el nuevo access token
          localStorage.setItem(STORAGE_KEYS.TOKEN, access);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          
          // Reintentar la solicitud original
          config.headers['Authorization'] = `Bearer ${access}`;
          return axiosInstance(config);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          removeToken();
          removeUser();
          window.location.href = '/login';
        }
      }
      
      // Crear un error de API con la información disponible
      const apiError = new ApiError(
        error.response.data.message || error.response.data.error || 'Error en la petición',
        status,
        error.response.data.code,
        error.response.data.details
      );
      
      const handledError = errorHandler.handle(apiError);
      
      // Emitir evento para notificar a los componentes
      window.dispatchEvent(new CustomEvent('apiError', {
        detail: handledError
      }));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 