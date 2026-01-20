export const API_BASE_URL = 'https://echo-serv.tbxnet.com';

export const ENDPOINTS = {
  AUTH: '/v1/mobile/auth',
  DATA: '/v1/mobile/data',
};

export const AUTH_CREDENTIALS = {
  sub: 'ToolboxMobileTest',
};

// Carousel types from API
export const CAROUSEL_TYPES = {
  POSTER: 'poster',
  THUMB: 'thumb',
};

// Token refresh buffer (refresh 30 seconds before expiry)
export const TOKEN_REFRESH_BUFFER_MS = 30 * 1000;

// Cache duration for carousels (5 minutes)
export const CACHE_DURATION_MS = 5 * 60 * 1000;

// ============================================
// UI Constants - Colors
// ============================================
export const COLORS = {
  // Primary
  PRIMARY: '#e50914', // Red
  PRIMARY_DARK: '#b20710',

  // Backgrounds
  BACKGROUND: '#000',
  BACKGROUND_SECONDARY: '#0A0A0F',
  BACKGROUND_CARD: '#1a1a1a',
  BACKGROUND_ELEVATED: '#2a2a2a',
  BACKGROUND_PLACEHOLDER: '#2d2d2d',

  // Text
  TEXT_PRIMARY: '#fff',
  TEXT_SECONDARY: '#ccc',
  TEXT_TERTIARY: '#888',
  TEXT_DISABLED: '#666',

  // States
  ERROR: '#ff6b6b',
  SUCCESS: '#4caf50',

  // Overlays
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.7)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
};

// ============================================
// UI Constants - Dimensions
// ============================================
export const DIMENSIONS = {
  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 12,
  SPACING_LG: 16,
  SPACING_XL: 20,
  SPACING_XXL: 24,

  // Border radius
  RADIUS_SM: 4,
  RADIUS_MD: 8,
  RADIUS_LG: 12,
  RADIUS_ROUND: 22,

  // Video player
  PLAY_BUTTON_SIZE: 54,
  LOADING_RING_SIZE: 66,

  // Carousel items
  POSTER_ASPECT_RATIO: 1.5, // height = width * 1.5
  THUMB_ASPECT_RATIO: 0.5625, // 16:9 aspect ratio

  // Animation
  FADE_DURATION: 300,
  BOUNCE_DURATION: 600,
  SPIN_DURATION: 1000,
};

// ============================================
// UI Constants - Typography
// ============================================
export const TYPOGRAPHY = {
  FONT_SIZE_XS: 10,
  FONT_SIZE_SM: 11,
  FONT_SIZE_MD: 12,
  FONT_SIZE_BASE: 14,
  FONT_SIZE_LG: 16,
  FONT_SIZE_XL: 18,
  FONT_SIZE_XXL: 24,
  FONT_SIZE_XXXL: 28,
};
