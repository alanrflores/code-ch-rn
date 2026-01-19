import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCarouselsThunk,
  selectItem as selectItemAction,
  clearSelectedItem as clearItemAction,
  selectCarousels,
  selectSelectedItem,
  selectCarouselsLoading,
  selectCarouselsError,
} from '../store/slices/carouselSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const useCarousels = (options = { autoFetch: true }) => {
  const dispatch = useDispatch();

  // Selectores
  const carousels = useSelector(selectCarousels);
  const selectedItem = useSelector(selectSelectedItem);
  const isLoading = useSelector(selectCarouselsLoading);
  const error = useSelector(selectCarouselsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Obtengo los carruseles desde la API
  const fetchCarousels = useCallback(async () => {
    try {
      await dispatch(fetchCarouselsThunk()).unwrap();
    } catch (err) {
      console.error('Failed to fetch carousels:', err);
    }
  }, [dispatch]);

  // Selecciono un item para el video playback
  const selectItem = useCallback(
    (item) => {
      dispatch(selectItemAction(item));
    },
    [dispatch]
  );

  // Limpio el item seleccionado (cierra el video player)
  const clearSelectedItem = useCallback(() => {
    dispatch(clearItemAction());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return fetchCarousels();
  }, [fetchCarousels]);

  // Auto-fetch si está habilitado
  useEffect(() => {
    if (options.autoFetch && carousels.length === 0) {
      fetchCarousels();
    }
  }, [options.autoFetch, fetchCarousels, carousels.length]);

  return {
    // Data
    carousels,
    selectedItem,
    // State
    isLoading,
    error,
    isEmpty: carousels.length === 0 && !isLoading,
    // Actions
    fetchCarousels,
    refetch,
    selectItem,
    clearSelectedItem,
  };
};

export default useCarousels;
