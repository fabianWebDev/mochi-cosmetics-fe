export const APP_NAME = 'Store FE';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://minasapi-12bab424078d.herokuapp.com/api';
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'https://minasapi-12bab424078d.herokuapp.com';

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

export const TOAST_DURATION = 2000;

export const CURRENCY = 'USD';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
}; 