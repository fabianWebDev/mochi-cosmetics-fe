import axiosInstance from './axios';
import { authService } from './authService';

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
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to create an order');
            }
            const response = await axiosInstance.post('/my-orders/', orderData);
            return response.data;
        } catch (error) {
            logError(error, 'createOrder');
            throw error;
        }
    },

    async getOrders() {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to view orders');
            }
            const response = await axiosInstance.get('/my-orders/');
            return response.data.results || [];
        } catch (error) {
            logError(error, 'getOrders');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to view order details');
            }
            if (!orderId) {
                throw new Error('Order ID is required');
            }
            console.log('Fetching order with ID:', orderId);
            const response = await axiosInstance.get(`/orders/${orderId}/`);
            return response.data;
        } catch (error) {
            logError(error, 'getOrderById');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to update order status');
            }
            const response = await axiosInstance.put(
                `/orders/${orderId}/`,
                { status }
            );
            return response.data;
        } catch (error) {
            logError(error, 'updateOrderStatus');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    async deleteOrder(orderId) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to delete an order');
            }
            await axiosInstance.delete(`/orders/${orderId}/`);
        } catch (error) {
            logError(error, 'deleteOrder');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    async updateProductStock(productId, newStock) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to update product stock');
            }
            const response = await axiosInstance.put(
                `/products/${productId}/update_stock/`,
                { stock: newStock }
            );
            return response.data;
        } catch (error) {
            logError(error, 'updateProductStock');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    async getShippingMethods() {
        try {
            const response = await axiosInstance.get('/shipping-methods/');
            return response.data.results || [];
        } catch (error) {
            logError(error, 'getShippingMethods');
            throw error;
        }
    },

    async cancelOrder(orderId) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to cancel an order');
            }
            const response = await axiosInstance.post(`/orders/${orderId}/cancel/`);
            return response.data;
        } catch (error) {
            logError(error, 'cancelOrder');
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },
}; 