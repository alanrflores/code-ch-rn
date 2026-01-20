import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { getCarousels, transformCarouselData } from '../../api/carouselService';
import { ensureValidTokenThunk } from './authSlice';

// Cache duration: 5 minutos en milliseconds
const CACHE_DURATION = 5 * 60 * 1000;

// Initial state
// isLoading empieza en true porque auto-fetch dispara al montar
const initialState = {
  carousels: [],
  selectedItem: null, // Item selected for video playback
  isLoading: true,
  error: null,
  lastFetched: null, // Timestamp for cache validation
};

// Async thunk para obtener los carruseles
export const fetchCarouselsThunk = createAsyncThunk(
  'carousels/fetch',
  async ({ force = false } = {}, { dispatch, getState, rejectWithValue }) => {
    try {
      // Validación de cache - omito la solicitud si los datos son frescos (a menos que se force)
      const { lastFetched, carousels } = getState().carousels;
      const isCacheValid = lastFetched && (Date.now() - lastFetched) < CACHE_DURATION;

      if (!force && isCacheValid && carousels.length > 0) {
        // Devuelvo los datos existentes para evitar una llamada a la API innecesaria
        return carousels;
      }

      // Asegurome de tener un token válido primero
      await dispatch(ensureValidTokenThunk()).unwrap();

      // Obtengo los datos del carrusel
      const data = await getCarousels();

      // Transformo los datos para mostrarlos en la UI
      const transformedData = transformCarouselData(data);

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch carousels');
    }
  }
);

// Creo el slice
const carouselSlice = createSlice({
  name: 'carousels',
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCarousels: (state) => {
      state.carousels = [];
      state.selectedItem = null;
      state.lastFetched = null;
    },
  },
  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarouselsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarouselsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carousels = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchCarouselsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { selectItem, clearSelectedItem, clearError, clearCarousels } =
  carouselSlice.actions;

// Export selectors
export const selectCarousels = (state) => state.carousels.carousels;
export const selectSelectedItem = (state) => state.carousels.selectedItem;
export const selectCarouselsLoading = (state) => state.carousels.isLoading;
export const selectCarouselsError = (state) => state.carousels.error;
export const selectLastFetched = (state) => state.carousels.lastFetched;

/**
 * Memoized selector for carousels by type , memorio
 * Uses createSelector to avoid re-computation on every render
 * Factory function pattern for parameterized selectors
 */
export const makeSelectCarouselsByType = (type) =>
  createSelector(
    [selectCarousels],
    (carousels) => carousels.filter((carousel) => carousel.type === type)
  );

// Selectores pre-creados para los tipos comunes (evito crear nuevos selectores por render)
export const selectPosterCarousels = makeSelectCarouselsByType('poster');
export const selectThumbCarousels = makeSelectCarouselsByType('thumb');

// Export reducer
export default carouselSlice.reducer;
