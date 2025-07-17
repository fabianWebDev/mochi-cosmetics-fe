/**
 * Order Service
 * 
 * This service handles all order-related operations including order creation,
 * retrieval, updates, and management. It provides a centralized interface for
 * order operations and ensures proper authentication checks for all order-related
 * actions.
 * 
 * Key Features:
 * - Order creation and management
 * - Order retrieval and filtering
 * - Order status updates
 * - Shipping method management
 * - Stock management for products
 * - Comprehensive error handling with authentication checks
 * 
 * @module orderService
 * @requires axiosInstance - Configured axios instance for API calls
 * @requires authService - Authentication service for user status checks
 * @example
 * import { orderService } from './orderService';
 * 
 * // Create a new order
 * const order = await orderService.createOrder({
 *   items: [...],
 *   shipping_address: {...},
 *   payment_method: 'credit_card'
 * });
 * 
 * // Get user orders
 * const orders = await orderService.getOrders();
 */

import axiosInstance from './axios';
import { authService } from './authService';

/**
 * Logs error details for debugging purposes
 * 
 * Provides consistent error logging across all order service operations
 * with detailed information about the error context.
 * 
 * @param {Error} error - The error object to log
 * @param {string} operation - The operation that failed
 * @private
 */
const logError = (error, operation) => {
    console.error(`Error in ${operation}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
    });
};

/**
 * Order service object containing all order-related methods
 * 
 * @type {Object}
 */
export const orderService = {
    /**
     * Creates a new order for the authenticated user
     * 
     * Submits order data to the backend to create a new order. Requires
     * user authentication and validates the order data structure.
     * 
     * @async
     * @param {Object} orderData - Order information
     * @param {Array} orderData.items - Array of order items with product and quantity
     * @param {Object} orderData.shipping_address - Shipping address information
     * @param {string} orderData.payment_method - Payment method identifier
     * @param {Object} [orderData.billing_address] - Billing address (optional)
     * @returns {Promise<Object>} Created order object
     * @throws {Error} When user is not authenticated or order creation fails
     * 
     * @example
     * try {
     *   const order = await orderService.createOrder({
     *     items: [
     *       { product_id: 123, quantity: 2 },
     *       { product_id: 456, quantity: 1 }
     *     ],
     *     shipping_address: {
     *       street: '123 Main St',
     *       city: 'New York',
     *       state: 'NY',
     *       zip_code: '10001'
     *     },
     *     payment_method: 'credit_card'
     *   });
     *   console.log('Order created:', order);
     * } catch (error) {
     *   console.error('Order creation failed:', error.message);
     * }
     */
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

    /**
     * Retrieves all orders for the authenticated user
     * 
     * Fetches the user's order history from the backend. Returns an array
     * of orders with their details and status information.
     * 
     * @async
     * @returns {Promise<Array>} Array of user orders
     * @throws {Error} When user is not authenticated or orders cannot be retrieved
     * 
     * @example
     * try {
     *   const orders = await orderService.getOrders();
     *   console.log('User orders:', orders);
     * } catch (error) {
     *   console.error('Failed to get orders:', error.message);
     * }
     */
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

    /**
     * Retrieves a specific order by its ID
     * 
     * Fetches detailed information about a specific order including items,
     * shipping information, and status details.
     * 
     * @async
     * @param {string|number} orderId - The unique identifier of the order
     * @returns {Promise<Object>} Order object with complete details
     * @throws {Error} When user is not authenticated, order ID is missing, or order not found
     * 
     * @example
     * try {
     *   const order = await orderService.getOrderById('ORD-12345');
     *   console.log('Order details:', order);
     * } catch (error) {
     *   console.error('Failed to get order:', error.message);
     * }
     */
    async getOrderById(orderId) {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('User must be authenticated to view order details');
            }
            if (!orderId) {
                throw new Error('Order ID is required');
            }
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

    /**
     * Updates the status of an existing order
     * 
     * Allows updating the order status (e.g., 'pending', 'shipped', 'delivered').
     * Only authenticated users can update their own orders.
     * 
     * @async
     * @param {string|number} orderId - The unique identifier of the order
     * @param {string} status - The new status for the order
     * @returns {Promise<Object>} Updated order object
     * @throws {Error} When user is not authenticated or status update fails
     * 
     * @example
     * try {
     *   const updatedOrder = await orderService.updateOrderStatus('ORD-12345', 'shipped');
     *   console.log('Order status updated:', updatedOrder);
     * } catch (error) {
     *   console.error('Status update failed:', error.message);
     * }
     */
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

    /**
     * Deletes an order from the system
     * 
     * Permanently removes an order from the backend. This action is irreversible
     * and should be used with caution.
     * 
     * @async
     * @param {string|number} orderId - The unique identifier of the order to delete
     * @returns {Promise<void>}
     * @throws {Error} When user is not authenticated or order deletion fails
     * 
     * @example
     * try {
     *   await orderService.deleteOrder('ORD-12345');
     *   console.log('Order deleted successfully');
     * } catch (error) {
     *   console.error('Order deletion failed:', error.message);
     * }
     */
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

    /**
     * Updates the stock quantity of a product
     * 
     * Allows administrators to update product stock levels. This is typically
     * used after order processing or inventory management.
     * 
     * @async
     * @param {number} productId - The unique identifier of the product
     * @param {number} newStock - The new stock quantity for the product
     * @returns {Promise<Object>} Updated product object
     * @throws {Error} When user is not authenticated or stock update fails
     * 
     * @example
     * try {
     *   const updatedProduct = await orderService.updateProductStock(123, 50);
     *   console.log('Product stock updated:', updatedProduct);
     * } catch (error) {
     *   console.error('Stock update failed:', error.message);
     * }
     */
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

    /**
     * Retrieves available shipping methods
     * 
     * Fetches the list of available shipping methods that can be used
     * when creating orders. This information is typically used in checkout.
     * 
     * @async
     * @returns {Promise<Array>} Array of available shipping methods
     * @throws {Error} When shipping methods cannot be retrieved
     * 
     * @example
     * try {
     *   const shippingMethods = await orderService.getShippingMethods();
     *   console.log('Available shipping methods:', shippingMethods);
     * } catch (error) {
     *   console.error('Failed to get shipping methods:', error.message);
     * }
     */
    async getShippingMethods() {
        try {
            const response = await axiosInstance.get('/shipping-methods/');
            return response.data.results || [];
        } catch (error) {
            logError(error, 'getShippingMethods');
            throw error;
        }
    },

    /**
     * Cancels an existing order
     * 
     * Allows users to cancel their orders before they are processed or shipped.
     * The order status will be updated to 'cancelled'.
     * 
     * @async
     * @param {string|number} orderId - The unique identifier of the order to cancel
     * @returns {Promise<Object>} Cancelled order object
     * @throws {Error} When user is not authenticated or order cancellation fails
     * 
     * @example
     * try {
     *   const cancelledOrder = await orderService.cancelOrder('ORD-12345');
     *   console.log('Order cancelled:', cancelledOrder);
     * } catch (error) {
     *   console.error('Order cancellation failed:', error.message);
     * }
     */
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