import axiosInstance from './axios';
import { authService } from './authService';
import { STORAGE_KEYS } from '../constants';
import { eventService } from './eventService';

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
        eventService.emit('cartUpdated', this.getCartCount());
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

    getCartItems() {
        return this.loadCartFromLocalStorage().items;
    }

    getCartTotal() {
        const cart = this.loadCartFromLocalStorage();
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    async mergeLocalCartWithBackend() {
        if (!authService.isAuthenticated()) {
            return;
        }

        const localCart = this.loadCartFromLocalStorage();
        let backendCartItems = await this.syncWithBackend();

        for (const localItem of localCart.items) {
            const backendItem = backendCartItems.find(item => item.product.id === localItem.product.id);

            if (backendItem) {
                // Establecer la cantidad máxima en lugar de sumarla cada vez
                const newQuantity = Math.max(backendItem.quantity, localItem.quantity);

                if (newQuantity > localItem.product.stock) {
                    console.warn(`Not enough stock for product ID ${localItem.product.id}. Available: ${localItem.product.stock}, Requested: ${newQuantity}`);
                    await this.updateQuantity(localItem.product.id, localItem.product.stock);
                } else if (backendItem.quantity !== newQuantity) { // Evitar actualización innecesaria
                    await this.updateQuantity(localItem.product.id, newQuantity);
                }
            } else {
                // Agregar nuevo producto si no está en el backend
                const quantityToAdd = Math.min(localItem.quantity, localItem.product.stock);
                if (quantityToAdd > 0) {
                    await this.addToCart(localItem.product.id, quantityToAdd, false);
                }
            }
        }

        // Limpiar el carrito local después de la fusión
        this.clearLocalCart();

        // Sincronizar nuevamente con el backend para reflejar los cambios
        backendCartItems = await this.syncWithBackend();
    }

    clearLocalCart() {
        localStorage.removeItem('cart');
        console.log('Local cart has been cleared.');
    }

    getCartCount() {
        const cart = this.loadCartFromLocalStorage();
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }
}

export const cartService = new CartService(); 