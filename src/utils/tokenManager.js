import { TOKEN_REFRESH_BUFFER_MS } from './constants';

/**
* Decodifico la carga útil de un token JWT sin verificación
* Estructura JWT: header.payload.signature (codificado en base64)
*
* @param {string} token - El token JWT
* @returns {object|null} - Carga útil decodificada o null si no es válida
*/
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decodifico la carga útil (parte central)
    // atob está disponible en el entorno js de RN
    const payload = parts[1];
    const decoded = atob(payload);

    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Verifico si un token ha expirado
 * La API devuelve expireDate en formato ISO
 *
 * @param {string} token - El token JWT
 * @returns {boolean} - True si expiró
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.expireDate) return true;

  const expireDate = new Date(decoded.expireDate);
  const now = new Date();

  return now >= expireDate;
};

/**
 * Checks if token needs refresh (before actual expiration)
 * Actualizo TOKEN_REFRESH_BUFFER_MS antes de la expiración para evitar
 * que las solicitudes fallen debido a que el token expira en medio de la solicitud
 *
 * @param {string} token - El token JWT
 * @returns {boolean} - True si debe actualizarse
 */
export const shouldRefreshToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.expireDate) return true;

  const expireDate = new Date(decoded.expireDate);
  const refreshThreshold = new Date(expireDate.getTime() - TOKEN_REFRESH_BUFFER_MS);
  const now = new Date();

  return now >= refreshThreshold;
};

/**
 * Obtengo el tiempo restante hasta que el token expira
 * para debugging y logging
 *
 * @param {string} token - El token JWT
 * @returns {number} - Milisegundos hasta la expiración, o 0 si expiró
 */
export const getTokenRemainingTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.expireDate) return 0;

  const expireDate = new Date(decoded.expireDate);
  const now = new Date();
  const remaining = expireDate.getTime() - now.getTime();

  return Math.max(0, remaining);
};
