export const APP_NAME = 'Store FE';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://5cf4-201-202-14-163.ngrok-free.app/api';
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'https://5cf4-201-202-14-163.ngrok-free.app';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  CART: 'cart_data',
};

export const TOAST_DURATION = 3000;

export const CURRENCY = 'USD';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
}; 