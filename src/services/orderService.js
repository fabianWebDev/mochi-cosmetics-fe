import axiosInstance from './axios';

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
            const response = await axiosInstance.post('/orders/', orderData);
            return response.data;
        } catch (error) {
            logError(error, 'createOrder');
            throw error;
        }
    },

    async getOrders() {
        try {
            const response = await axiosInstance.get('/my-orders/');
            return response.data;
        } catch (error) {
            logError(error, 'getOrders');
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}/`);
            return response.data;
        } catch (error) {
            logError(error, 'getOrderById');
            throw error;
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            const response = await axiosInstance.put(
                `/orders/${orderId}/`,
                { status }
            );
            return response.data;
        } catch (error) {
            logError(error, 'updateOrderStatus');
            throw error;
        }
    },

    async deleteOrder(orderId) {
        try {
            await axiosInstance.delete(`/orders/${orderId}/`);
        } catch (error) {
            logError(error, 'deleteOrder');
            throw error;
        }
    },

    async updateProductStock(productId, quantity, operation) {
        try {
            const response = await axiosInstance.put(
                `/products/${productId}/update-stock/`,
                { quantity, operation }
            );
            return response.data;
        } catch (error) {
            logError(error, 'updateProductStock');
            throw error;
        }
    },

    async cancelOrder(orderId) {
        try {
            const response = await axiosInstance.post(`/orders/${orderId}/cancel/`);
            return response.data;
        } catch (error) {
            logError(error, 'cancelOrder');
            throw error;
        }
    }
}; 