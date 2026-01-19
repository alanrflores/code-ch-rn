/**
 * Redux Store Configuration
 * Combines all slices and configures the store
 *
 * Why configureStore from RTK?
 * - Automatically sets up Redux DevTools
 * - Adds thunk middleware by default
 * - Enables Immer for immutable updates
 * - Combines reducers automatically
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carouselReducer from './slices/carouselSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    carousels: carouselReducer,
  },
  // Middleware is automatically configured with thunk
  // You can customize it if needed:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
