/**
 * Carousel Slice
 * Manages carousel data state with Redux Toolkit
 *
 * Responsibilities:
 * - Store carousel data from API
 * - Track selected item for video playback
 * - Handle loading and error states
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCarousels, transformCarouselData } from '../../api/carouselService';
import { ensureValidTokenThunk } from './authSlice';

// Initial state
// isLoading empieza en true porque auto-fetch dispara al montar
const initialState = {
  carousels: [],
  selectedItem: null, // Item selected for video playback
  isLoading: true,
  error: null,
  lastFetched: null, // Timestamp for cache validation
};

/**
 * Async thunk to fetch carousels
 * Ensures valid token before making the request
 */
export const fetchCarouselsThunk = createAsyncThunk(
  'carousels/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Ensure we have a valid token first
      await dispatch(ensureValidTokenThunk()).unwrap();

      // Fetch carousel data
      const data = await getCarousels();

      // Transform data for display
      const transformedData = transformCarouselData(data);

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch carousels');
    }
  }
);

// Create the slice
const carouselSlice = createSlice({
  name: 'carousels',
  initialState,
  reducers: {
    /**
     * Sets the selected item for video playback
     * @param {object} action.payload - The carousel item to play
     */
    selectItem: (state, action) => {
      state.selectedItem = action.payload;
    },

    /**
     * Clears the selected item (close video player)
     */
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },

    /**
     * Clears error state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clears all carousel data (for logout)
     */
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

/**
 * Memoized selector for carousels by type
 * Useful when you need to get only poster or thumb carousels
 */
export const selectCarouselsByType = (type) => (state) =>
  state.carousels.carousels.filter((carousel) => carousel.type === type);

// Export reducer
export default carouselSlice.reducer;
