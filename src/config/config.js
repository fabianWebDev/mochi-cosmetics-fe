export const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000',
    API_VERSION: 'api',
    ENDPOINTS: {
        ORDERS: '/orders',
        PRODUCTS: '/products',
        CART: '/cart',
        AUTH: '/auth',
        MY_ORDERS: '/my-orders'
    }
};

export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
}; 