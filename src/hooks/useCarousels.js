import { useCallback, useEffect, useRef } from 'react';
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
  // Track si ya hicimos fetch para evitar loops
  const hasFetchedRef = useRef(false);

  // Selectores
  const carousels = useSelector(selectCarousels);
  const selectedItem = useSelector(selectSelectedItem);
  const isLoading = useSelector(selectCarouselsLoading);
  const error = useSelector(selectCarouselsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Obtengo los carruseles desde la API (con cache validation automática en el thunk)
  const fetchCarousels = useCallback(async (force = false) => {
    try {
      await dispatch(fetchCarouselsThunk({ force })).unwrap();
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

  // Fuerza refetch ignorando cache
  const refetch = useCallback(() => {
    return fetchCarousels(true);
  }, [fetchCarousels]);

  // Auto-fetch si está habilitado (solo una vez por mount)
  // El thunk maneja cache validation internamente
  useEffect(() => {
    if (options.autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCarousels();
    }
  }, [options.autoFetch, fetchCarousels]);

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
