/**
 * Cart Service
 * 
 * This service manages the shopping cart functionality, handling both local storage
 * and backend synchronization. It provides a unified interface for cart operations
 * regardless of user authentication status, with automatic fallback to local storage
 * when backend operations fail.
 * 
 * Key Features:
 * - Dual storage: Local storage for guest users, backend sync for authenticated users
 * - Automatic cart merging when users log in
 * - Stock validation and quantity management
 * - Real-time cart updates with event emission
 * - Error handling with graceful fallbacks
 * 
 * @module cartService
 * @requires axiosInstance - Configured axios instance for API calls
 * @requires authService - Authentication service for user status checks
 * @requires STORAGE_KEYS - Constants for localStorage keys
 * @requires eventService - Event service for cart update notifications
 */

import axiosInstance from './axios';
import { authService } from './authService';
import { STORAGE_KEYS } from '../constants';
import { eventService } from './eventService';

/**
 * Cart Service Class
 * 
 * Manages shopping cart operations with support for both local storage and backend
 * synchronization. Handles cart persistence, quantity updates, and stock validation.
 * 
 * @class CartService
 */
class CartService {
    /**
     * Creates a new CartService instance
     * 
     * Initializes the service by loading the current cart from localStorage
     * and setting up the internal cart state.
     * 
     * @constructor
     * @example
     * const cartService = new CartService();
     */
    constructor() {
        this.cart = this.loadCartFromLocalStorage();
    }

    /**
     * Loads cart data from localStorage
     * 
     * Retrieves the saved cart from browser storage and parses it as JSON.
     * Returns an empty cart structure if no data exists.
     * 
     * @returns {Object} Cart object with items array
     * @example
     * const cart = cartService.loadCartFromLocalStorage();
     * console.log('Cart items:', cart.items);
     */
    loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    }

    /**
     * Saves cart data to localStorage and emits update event
     * 
     * Persists the cart data to browser storage and notifies other components
     * about the cart update through the event service.
     * 
     * @param {Object} cart - Cart object to save
     * @param {Array} cart.items - Array of cart items
     * 
     * @example
     * const cart = { items: [{ product: {...}, quantity: 2 }] };
     * cartService.saveCartToLocalStorage(cart);
     */
    saveCartToLocalStorage(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        eventService.emit('cartUpdated', this.getCartCount());
    }

    /**
     * Synchronizes local cart with backend data
     * 
     * Fetches the current cart from the backend for authenticated users and
     * updates the local storage. Handles cases where the backend cart doesn't exist
     * by creating a new one with local items.
     * 
     * @async
     * @returns {Promise<Array>} Array of cart items from backend
     * @throws {Error} When backend communication fails
     * 
     * @example
     * try {
     *   const items = await cartService.syncWithBackend();
     *   console.log('Synced cart items:', items);
     * } catch (error) {
     *   console.error('Sync failed:', error);
     * }
     */
    async syncWithBackend() {
        if (!authService.isAuthenticated()) {
            return this.loadCartFromLocalStorage().items;
        }
        try {
            const response = await axiosInstance.get('/cart/');
            const cartData = {
                items: response.data.items.map(item => ({
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image,
                        stock: item.product.stock,
                        tax: item.product.tax
                    },
                    quantity: item.quantity,
                    cartItemId: item.id
                }))
            };

            this.saveCartToLocalStorage(cartData);
            return cartData.items;
        } catch (error) {
            console.error('Error syncing cart:', error);
            if (error.response?.status === 404) {
                // Create a new cart in the backend with local items
                const localCart = this.loadCartFromLocalStorage();
                if (localCart.items.length > 0) {
                    try {
                        // Create new cart items in the backend
                        for (const item of localCart.items) {
                            await this.addToCart(item.product.id, item.quantity, false);
                        }
                        // Sync again to get the new cart with proper IDs
                        return await this.syncWithBackend();
                    } catch (createError) {
                        console.error('Error creating new cart:', createError);
                        return localCart.items;
                    }
                }
                return localCart.items;
            }
            throw error;
        }
    }

    /**
     * Adds a product to the cart
     * 
     * Adds a product to the cart with the specified quantity. For authenticated users,
     * the item is added to the backend; for guest users, it's stored locally.
     * Automatically handles authentication failures by falling back to local storage.
     * 
     * @async
     * @param {number} productId - ID of the product to add
     * @param {number} quantity - Quantity to add (default: 1)
     * @param {boolean} updateLocal - Whether to update local storage after backend operation (default: true)
     * @returns {Promise<Object>} Updated cart data
     * @throws {Error} When product cannot be added to cart
     * 
     * @example
     * try {
     *   const result = await cartService.addToCart(123, 2);
     *   console.log('Product added to cart:', result);
     * } catch (error) {
     *   console.error('Failed to add product:', error);
     * }
     */
    async addToCart(productId, quantity = 1, updateLocal = true) {
        try {
            if (authService.isAuthenticated()) {
                // Si está autenticado, intentar agregar al backend
                const response = await axiosInstance.post('/cart/', {
                    product_id: productId,
                    quantity: quantity
                });

                if (updateLocal) {
                    await this.syncWithBackend();
                }

                return response.data;
            } else {
                // Si no está autenticado, agregar al carrito local
                return await this.addToLocalCart(productId, quantity);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Si falla la autenticación, manejarlo con el carrito local
                return await this.addToLocalCart(productId, quantity);
            }
            throw error;
        }
    }

    /**
     * Adds a product to the local cart storage
     * 
     * Fetches product details from the backend and adds them to the local cart.
     * If the product already exists, the quantity is increased.
     * 
     * @async
     * @param {number} productId - ID of the product to add
     * @param {number} quantity - Quantity to add
     * @returns {Promise<Object>} Updated cart data
     * @throws {Error} When product details cannot be fetched or cart cannot be updated
     * 
     * @example
     * try {
     *   const cart = await cartService.addToLocalCart(123, 1);
     *   console.log('Local cart updated:', cart);
     * } catch (error) {
     *   console.error('Failed to update local cart:', error);
     * }
     */
    async addToLocalCart(productId, quantity) {
        try {
            const cart = this.loadCartFromLocalStorage();
            const existingItem = cart.items.find(item => item.product.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const productResponse = await axiosInstance.get(`/products/${productId}/`);
                cart.items.push({
                    product: productResponse.data,
                    quantity: quantity
                });
            }

            this.saveCartToLocalStorage(cart);
            return cart;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    }

    /**
     * Updates the quantity of a product in the cart
     * 
     * Updates the quantity of a specific product in the cart. For authenticated users,
     * the update is performed on the backend; for guest users, it's updated locally.
     * 
     * @async
     * @param {number} productId - ID of the product to update
     * @param {number} newQuantity - New quantity for the product
     * @returns {Promise<Object>} Updated cart data
     * @throws {Error} When product cannot be found or quantity cannot be updated
     * 
     * @example
     * try {
     *   const result = await cartService.updateQuantity(123, 5);
     *   console.log('Quantity updated:', result);
     * } catch (error) {
     *   console.error('Failed to update quantity:', error);
     * }
     */
    async updateQuantity(productId, newQuantity) {
        const cart = this.loadCartFromLocalStorage();

        try {
            if (authService.isAuthenticated()) {
                // Encontrar el cartItemId correspondiente al productId
                const cartItem = cart.items.find(item => item.product.id === productId);
                if (!cartItem) throw new Error('Item not found in cart');

                // Actualizar en el backend usando el cartItemId
                const response = await axiosInstance.put(
                    `/cart/item/${cartItem.cartItemId}/`,
                    { quantity: newQuantity }
                );

                await this.syncWithBackend();
                return response.data;
            } else {
                // Actualización local
                const item = cart.items.find(item => item.product.id === productId);
                if (item) {
                    item.quantity = newQuantity;
                    this.saveCartToLocalStorage(cart);
                }
                return cart;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Si falla la autenticación, actualizar localStorage
                const item = cart.items.find(item => item.product.id === productId);
                if (item) {
                    item.quantity = newQuantity;
                    this.saveCartToLocalStorage(cart);
                }
                return cart;
            }
            throw error;
        }
    }

    /**
     * Removes a product from the cart
     * 
     * Removes a specific product from the cart. For authenticated users, the item
     * is removed from the backend; for guest users, it's removed from local storage.
     * Handles cases where the backend item doesn't exist by proceeding with local removal.
     * 
     * @async
     * @param {number} productId - ID of the product to remove
     * @returns {Promise<void>}
     * @throws {Error} When removal operation fails
     * 
     * @example
     * try {
     *   await cartService.removeFromCart(123);
     *   console.log('Product removed from cart');
     * } catch (error) {
     *   console.error('Failed to remove product:', error);
     * }
     */
    async removeFromCart(productId) {
        const cart = this.loadCartFromLocalStorage();

        try {
            if (authService.isAuthenticated()) {
                // Find the cartItemId corresponding to the productId
                const cartItem = cart.items.find(item => item.product.id === productId);
                if (!cartItem) {
                    console.warn('Item not found in cart');
                    return;
                }

                try {
                    // Delete from the backend using the cartItemID
                    await axiosInstance.delete(`/cart/item/${cartItem.cartItemId}/`);
                } catch (error) {
                    if (error.response?.status === 404) {
                        console.warn('Cart item not found in backend, proceeding with local removal');
                        // Try to sync with backend to get fresh cart data
                        try {
                            await this.syncWithBackend();
                        } catch (syncError) {
                            console.warn('Error syncing after 404:', syncError);
                        }
                    } else {
                        throw error;
                    }
                }

                // Remove from local cart first
                cart.items = cart.items.filter(item => item.product.id !== productId);
                this.saveCartToLocalStorage(cart);

                // Then try to sync with backend
                try {
                    await this.syncWithBackend();
                } catch (syncError) {
                    console.warn('Error syncing after removal:', syncError);
                }
            } else {
                // Eliminar localmente
                cart.items = cart.items.filter(item => item.product.id !== productId);
                this.saveCartToLocalStorage(cart);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Si falla la autenticación, eliminar de localStorage
                cart.items = cart.items.filter(item => item.product.id !== productId);
                this.saveCartToLocalStorage(cart);
            } else {
                console.error('Error removing item from cart:', error);
                // Even if there's an error, ensure the item is removed locally
                cart.items = cart.items.filter(item => item.product.id !== productId);
                this.saveCartToLocalStorage(cart);
                throw error;
            }
        }
    }

    /**
     * Clears all items from the cart
     * 
     * Removes all items from both the backend (for authenticated users) and local storage.
     * Ensures the cart is cleared even if backend operations fail.
     * 
     * @async
     * @returns {Promise<void>}
     * 
     * @example
     * try {
     *   await cartService.clearCart();
     *   console.log('Cart cleared successfully');
     * } catch (error) {
     *   console.error('Error clearing cart:', error);
     * }
     */
    async clearCart() {
        try {
            if (authService.isAuthenticated()) {
                // Intentar limpiar el carrito en el backend
                const cart = this.loadCartFromLocalStorage();
                for (const item of cart.items) {
                    if (item.cartItemId) {
                        try {
                            await this.removeFromCart(item.product.id);
                        } catch (error) {
                            console.warn(`Failed to remove item ${item.product.id} from backend:`, error);
                            // Continue with next item even if one fails
                        }
                    }
                }
            }
            // Always clear local storage regardless of backend status
            localStorage.removeItem(STORAGE_KEYS.CART);
            this.cart = { items: [] };
        } catch (error) {
            console.error('Error clearing cart:', error);
            // Even if there's an error, clear the local cart
            localStorage.removeItem(STORAGE_KEYS.CART);
            this.cart = { items: [] };
        }
    }

    /**
     * Gets all items in the current cart
     * 
     * Returns an array of all items currently in the cart from local storage.
     * 
     * @returns {Array} Array of cart items
     * 
     * @example
     * const items = cartService.getCartItems();
     * console.log('Cart items:', items);
     */
    getCartItems() {
        return this.loadCartFromLocalStorage().items;
    }

    /**
     * Calculates the total price of all items in the cart
     * 
     * Sums up the total cost of all items in the cart by multiplying
     * each item's price by its quantity.
     * 
     * @returns {number} Total cart value
     * 
     * @example
     * const total = cartService.getCartTotal();
     * console.log('Cart total: $', total);
     */
    getCartTotal() {
        const cart = this.loadCartFromLocalStorage();
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    /**
     * Merges local cart with backend cart when user logs in
     * 
     * When a user authenticates, this method merges any items in the local cart
     * with the backend cart. It handles stock validation and quantity conflicts
     * by taking the maximum quantity for each product.
     * 
     * @async
     * @returns {Promise<void>}
     * 
     * @example
     * // Called automatically when user logs in
     * await cartService.mergeLocalCartWithBackend();
     */
    async mergeLocalCartWithBackend() {
        if (!authService.isAuthenticated()) {
            return;
        }

        try {
            const localCart = this.loadCartFromLocalStorage();
            if (!localCart.items || localCart.items.length === 0) {
                // If local cart is empty, just sync with backend
                await this.syncWithBackend();
                return;
            }

            let backendCartItems = [];
            try {
                backendCartItems = await this.syncWithBackend();
            } catch (error) {
                console.warn('Error syncing with backend, proceeding with local cart:', error);
                // If sync fails, we'll proceed with an empty backend cart
            }

            for (const localItem of localCart.items) {
                try {
                    const backendItem = backendCartItems.find(item => item.product.id === localItem.product.id);

                    if (backendItem) {
                        // Set the maximum quantity instead of adding them
                        const newQuantity = Math.max(backendItem.quantity, localItem.quantity);

                        if (newQuantity > localItem.product.stock) {
                            console.warn(`Not enough stock for product ID ${localItem.product.id}. Available: ${localItem.product.stock}, Requested: ${newQuantity}`);
                            await this.updateQuantity(localItem.product.id, localItem.product.stock);
                        } else if (backendItem.quantity !== newQuantity) {
                            await this.updateQuantity(localItem.product.id, newQuantity);
                        }
                    } else {
                        // Add new product if not in backend
                        const quantityToAdd = Math.min(localItem.quantity, localItem.product.stock);
                        if (quantityToAdd > 0) {
                            await this.addToCart(localItem.product.id, quantityToAdd, false);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing item ${localItem.product.id}:`, error);
                    // Continue with next item even if one fails
                }
            }

            // Clear the local cart after successful merge
            this.clearLocalCart();

            // Final sync to ensure everything is up to date
            await this.syncWithBackend();
        } catch (error) {
            console.error('Error merging carts:', error);
            // If something goes wrong, ensure we at least have the local cart
            const localCart = this.loadCartFromLocalStorage();
            this.saveCartToLocalStorage(localCart);
        }
    }

    /**
     * Clears only the local cart storage
     * 
     * Removes the cart data from localStorage without affecting the backend.
     * Used during cart merging operations.
     * 
     * @example
     * cartService.clearLocalCart();
     */
    clearLocalCart() {
        localStorage.removeItem('cart');
    }

    /**
     * Gets the total number of items in the cart
     * 
     * Calculates the sum of all item quantities in the cart.
     * 
     * @returns {number} Total number of items in cart
     * 
     * @example
     * const count = cartService.getCartCount();
     * console.log('Items in cart:', count);
     */
    getCartCount() {
        const cart = this.loadCartFromLocalStorage();
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }
}

/**
 * Cart service instance
 * 
 * Singleton instance of the CartService class that provides cart management
 * functionality throughout the application.
 * 
 * @type {CartService}
 * 
 * @example
 * import { cartService } from './services/cartService';
 * 
 * // Add item to cart
 * await cartService.addToCart(123, 2);
 * 
 * // Get cart items
 * const items = cartService.getCartItems();
 * 
 * // Get cart total
 * const total = cartService.getCartTotal();
 */
export const cartService = new CartService(); 