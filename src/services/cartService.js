import axiosInstance from './axios';
import { API_BASE_URL } from '../constants';
import { authService } from './authService';
import { STORAGE_KEYS } from '../constants';

class CartService {
    constructor() {
        this.cart = this.loadCartFromLocalStorage();
    }

    loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    }

    saveCartToLocalStorage(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }

    async syncWithBackend() {
        if (!authService.isAuthenticated()) {
            return this.loadCartFromLocalStorage().items;
        }

        try {
            console.log('Iniciando sincronización con el backend');
            
            // Obtener el carrito del backend
            const response = await axiosInstance.get('/cart/');

            // Transformar la respuesta del backend al formato local
            const cartData = {
                items: response.data.items.map(item => ({
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image,
                        stock: item.product.stock
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
                console.log('No active cart found, using local cart');
                return this.loadCartFromLocalStorage().items;
            }
            throw error;
        }
    }

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
                // Si no está autenticado, usar localStorage
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
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Si falla la autenticación, usar localStorage
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
            }
            throw error;
        }
    }

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

    async removeFromCart(productId) {
        const cart = this.loadCartFromLocalStorage();

        try {
            if (authService.isAuthenticated()) {
                // Encontrar el cartItemId correspondiente al productId
                const cartItem = cart.items.find(item => item.product.id === productId);
                if (!cartItem) throw new Error('Item not found in cart');

                // Eliminar del backend usando el cartItemId
                await axiosInstance.delete(`/cart/item/${cartItem.cartItemId}/`);

                await this.syncWithBackend();
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
                throw error;
            }
        }
    }

    async clearCart() {
        try {
            if (authService.isAuthenticated()) {
                // Intentar limpiar el carrito en el backend
                const cart = this.loadCartFromLocalStorage();
                for (const item of cart.items) {
                    await this.removeFromCart(item.product.id);
                }
            } else {
                // Limpiar localStorage
                localStorage.removeItem(STORAGE_KEYS.CART);
                this.cart = { items: [] };
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Si falla la autenticación, limpiar localStorage
                localStorage.removeItem(STORAGE_KEYS.CART);
                this.cart = { items: [] };
            } else {
                throw error;
            }
        }
    }

    getCartItems() {
        return this.loadCartFromLocalStorage().items;
    }

    getCartTotal() {
        const cart = this.loadCartFromLocalStorage();
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }
}

export const cartService = new CartService(); 