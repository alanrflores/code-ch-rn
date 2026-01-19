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
