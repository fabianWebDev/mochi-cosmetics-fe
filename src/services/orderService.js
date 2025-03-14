import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../config/config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const logError = (error, operation) => {
    console.error(`Error in ${operation}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
    });
};

export const orderService = {
    async createOrder(orderData) {
        try {
            console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
            const response = await axios.post(
                getApiUrl(API_CONFIG.ENDPOINTS.ORDERS) + '/',
                orderData,
                { headers: getAuthHeaders() }
            );
            console.log('Order creation response:', response.data);
            return response;
        } catch (error) {
            logError(error, 'createOrder');
            throw error;
        }
    },

    async getOrders() {
        try {
            return await axios.get(
                getApiUrl(API_CONFIG.ENDPOINTS.MY_ORDERS) + '/',
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            logError(error, 'getOrders');
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            return await axios.get(
                getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}/`),
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            logError(error, 'getOrderById');
            throw error;
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            return await axios.put(
                getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}/`),
                { status },
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            logError(error, 'updateOrderStatus');
            throw error;
        }
    },

    async deleteOrder(orderId) {
        try {
            return await axios.delete(
                getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}/`),
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            logError(error, 'deleteOrder');
            throw error;
        }
    },

    async updateProductStock(productId, quantity, operation) {
        try {
            return await axios.put(
                getApiUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}/update-stock/`),
                { quantity, operation },
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            logError(error, 'updateProductStock');
            throw error;
        }
    }
}; 