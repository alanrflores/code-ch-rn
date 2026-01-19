import apiClient, { setAuthToken, clearAuthToken } from './client';
import { ENDPOINTS, AUTH_CREDENTIALS } from '../utils/constants';

// Realizo el login para obtener el token de autenticación
export const login = async () => {
  try {
    const response = await apiClient.post(ENDPOINTS.AUTH, AUTH_CREDENTIALS);

    const { token, type } = response.data;

    if (!token) {
      throw new Error('No token received from server');
    }

    // Almaceno el token en el cliente para las solicitudes posteriores
    setAuthToken(token, type);

    return {
      token,
      type,
    };
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
};

// Me desconecto borrando el token almacenado
export const logout = () => {
  clearAuthToken();
};

// Actualizo el token realizando un nuevo login
export const refreshToken = async () => {
  // Borro el token existente primero
  clearAuthToken();

  // Me inicio sesión nuevamente para obtener un nuevo token
  return login();
};
