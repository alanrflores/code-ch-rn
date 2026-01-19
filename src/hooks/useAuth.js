import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginThunk,
  logout as logoutAction,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  // Selectores
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = useCallback(async () => {
    try {
      await dispatch(loginThunk()).unwrap();
    } catch (err) {
      // El error ya está en el estado de Redux
      console.error('Login failed:', err);
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    // Actions
    login,
    logout,
  };
};

export default useAuth;
