import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Creo una instancia de axios con la configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Almacenamiento del token (en memoria para simplicidad)
// En producción, usaría AsyncStorage o SecureStore 
let authToken = null;
let tokenType = 'Bearer';

export const setAuthToken = (token, type = 'Bearer') => {
  authToken = token;
  tokenType = type;
};

// Limpio el token de autenticación
export const clearAuthToken = () => {
  authToken = null;
  tokenType = 'Bearer';
};

// Obtengo el token de autenticación actual
export const getAuthToken = () => authToken;

// Interceptor de solicitud - añade el encabezado de autorización
apiClient.interceptors.request.use(
  (config) => {
    // Añado el encabezado de autorización si el token existe y no estoy haciendo una solicitud al endpoint de autenticación
    if (authToken && !config.url.includes('/auth')) {
      config.headers.Authorization = `${tokenType} ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta - manejo los errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo casos de error específicos
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Token expirado o inválido - lo limpio
          clearAuthToken();
          // El hook/slice se encargará de la re-autenticación
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Error de red - no se recibió respuesta
      console.error('Network error - no response received');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
