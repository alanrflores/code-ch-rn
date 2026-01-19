import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, refreshToken as apiRefresh } from '../../api/authService';
import { getAuthToken } from '../../api/client';
import { isTokenExpired, shouldRefreshToken } from '../../utils/tokenManager';

// Estado inicial
const initialState = {
  token: null,
  tokenType: 'Bearer',
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Async thunk para iniciar sesión
 * Manejo la operación asíncrona de inicio de sesión con el estado automático
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiLogin();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Async thunk para actualizar el token
 * Me vuelvo a autenticar cuando el token está a punto de expirar
 */
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiRefresh();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

/**
 * Async thunk para asegurarme de que el token sea válido antes de las llamadas a la API
 * Verifico la expiración y actualizo si es necesario
 */
export const ensureValidTokenThunk = createAsyncThunk(
  'auth/ensureValidToken',
  async (_, { getState, dispatch }) => {
    const { auth } = getState();

    // Si no está autenticado, me inicio sesión
    if (!auth.isAuthenticated || !auth.token) {
      return dispatch(loginThunk()).unwrap();
    }

    // Verifico si el token necesita ser actualizado
    if (shouldRefreshToken(auth.token)) {
      return dispatch(refreshTokenThunk()).unwrap();
    }

    // El token aún es válido
    return { token: auth.token, type: auth.tokenType };
  }
);

// Creo el slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acción sincrónica para limpiar el estado de autenticación (logout)
    logout: (state) => {
      state.token = null;
      state.tokenType = 'Bearer';
      state.isAuthenticated = false;
      state.error = null;
    },
    // Limpio el error
    clearError: (state) => {
      state.error = null;
    },
  },
  // Manejo los estados de los thunks asíncronos
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.tokenType = action.payload.type;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Actualizo el token
      .addCase(refreshTokenThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.tokenType = action.payload.type;
        state.error = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // En caso de fallo en la actualización del token, me desconecto
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Exporto las acciones
export const { logout, clearError } = authSlice.actions;

// Exporto los selectores
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

// Exporto el reducer
export default authSlice.reducer;
