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

// Almacenamiento del token en memoria (ver documentación arriba)
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

/**
 * Error Types para mejor handling en la UI
 */
export const API_ERROR_TYPES = {
  TIMEOUT: 'TIMEOUT',
  NETWORK: 'NETWORK',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
};

const getErrorType = (error) => {
  // Timeout específico de Axios
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return API_ERROR_TYPES.TIMEOUT;
  }

  // Error de red (sin respuesta del servidor)
  if (error.request && !error.response) {
    return API_ERROR_TYPES.NETWORK;
  }

  // Errores HTTP con respuesta
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return API_ERROR_TYPES.UNAUTHORIZED;
      case 403:
        return API_ERROR_TYPES.FORBIDDEN;
      case 500:
      case 502:
      case 503:
      case 504:
        return API_ERROR_TYPES.SERVER_ERROR;
      default:
        return API_ERROR_TYPES.UNKNOWN;
    }
  }

  return API_ERROR_TYPES.UNKNOWN;
};

/**
 * Genera un mensaje de error user-friendly
 * @param {string} errorType - Tipo de error (API_ERROR_TYPES)
 * @returns {string} - Mensaje para mostrar al usuario
 */
const getErrorMessage = (errorType) => {
  switch (errorType) {
    case API_ERROR_TYPES.TIMEOUT:
      return 'La conexión tardó demasiado. Por favor, intenta de nuevo.';
    case API_ERROR_TYPES.NETWORK:
      return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    case API_ERROR_TYPES.UNAUTHORIZED:
      return 'Sesión expirada. Reconectando...';
    case API_ERROR_TYPES.FORBIDDEN:
      return 'No tienes permiso para acceder a este recurso.';
    case API_ERROR_TYPES.SERVER_ERROR:
      return 'Error en el servidor. Por favor, intenta más tarde.';
    default:
      return 'Ocurrió un error inesperado.';
  }
};

// Interceptor de respuesta - manejo los errores globalmente con contexto enriquecido
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enriquecer el error con tipo y mensaje user-friendly
    const errorType = getErrorType(error);
    const userMessage = getErrorMessage(errorType);

    // Agregar contexto al error para mejor debugging y UX
    error.errorType = errorType;
    error.userMessage = userMessage;

    // Log estructurado para debugging
    console.error('[API Error]', {
      type: errorType,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.message,
    });

    // Manejo casos de error específicos
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Token expirado o inválido - lo limpio
          // El thunk se encargará de la re-autenticación automática
          clearAuthToken();
          break;
        case 403:
          // Access forbidden - podría ser un problema de permisos
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - el usuario debería reintentar
          break;
        default:
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
