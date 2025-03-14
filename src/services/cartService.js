import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

class CartService {
    constructor() {
        this.cart = this.loadCartFromLocalStorage();
    }

    getAuthHeaders() {
        const token = localStorage.getItem('accessToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    }

    saveCartToLocalStorage(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    async syncWithBackend() {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            console.log('Iniciando sincronización con el backend');
            
            // Obtener el carrito del backend
            const response = await axios.get(`${BASE_URL}/api/cart/`, {
                headers: this.getAuthHeaders()
            });

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
                    cartItemId: item.id // Guardamos el ID del CartItem para actualizaciones
                }))
            };

            this.saveCartToLocalStorage(cartData);
            return cartData.items;
        } catch (error) {
            console.error('Error syncing cart:', error);
            if (error.response && error.response.status === 404) {
                console.log('No active cart found, using local cart');
                return this.loadCartFromLocalStorage().items;
            }
            throw error;
        }
    }

    async addToCart(productId, quantity = 1, updateLocal = true) {
        const token = localStorage.getItem('accessToken');

        try {
            if (token) {
                // Si está autenticado, agregar al backend
                const response = await axios.post(
                    `${BASE_URL}/api/cart/`,
                    {
                        product_id: productId,
                        quantity: quantity
                    },
                    {
                        headers: this.getAuthHeaders()
                    }
                );

                if (updateLocal) {
                    await this.syncWithBackend();
                }

                return response.data;
            } else {
                // Si no está autenticado, solo actualizar localStorage
                const cart = this.loadCartFromLocalStorage();
                const existingItem = cart.items.find(item => item.product.id === productId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    const productResponse = await axios.get(`${BASE_URL}/api/products/${productId}/`);
                    cart.items.push({
                        product: productResponse.data,
                        quantity: quantity
                    });
                }

                this.saveCartToLocalStorage(cart);
                return cart;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async updateQuantity(productId, newQuantity) {
        const token = localStorage.getItem('accessToken');
        const cart = this.loadCartFromLocalStorage();

        try {
            if (token) {
                // Encontrar el cartItemId correspondiente al productId
                const cartItem = cart.items.find(item => item.product.id === productId);
                if (!cartItem) throw new Error('Item not found in cart');

                // Actualizar en el backend usando el cartItemId
                const response = await axios.put(
                    `${BASE_URL}/api/cart/item/${cartItem.cartItemId}/`,
                    { quantity: newQuantity },
                    { headers: this.getAuthHeaders() }
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
            console.error('Error updating quantity:', error);
            throw error;
        }
    }

    async removeFromCart(productId) {
        const token = localStorage.getItem('accessToken');
        const cart = this.loadCartFromLocalStorage();

        try {
            if (token) {
                // Encontrar el cartItemId correspondiente al productId
                const cartItem = cart.items.find(item => item.product.id === productId);
                if (!cartItem) throw new Error('Item not found in cart');

                // Eliminar del backend usando el cartItemId
                await axios.delete(
                    `${BASE_URL}/api/cart/item/${cartItem.cartItemId}/`,
                    { headers: this.getAuthHeaders() }
                );

                await this.syncWithBackend();
            } else {
                // Eliminar localmente
                cart.items = cart.items.filter(item => item.product.id !== productId);
                this.saveCartToLocalStorage(cart);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    async clearCart() {
        const token = localStorage.getItem('accessToken');
        
        try {
            if (token) {
                // Si está autenticado, eliminar todos los items uno por uno
                const cart = this.loadCartFromLocalStorage();
                for (const item of cart.items) {
                    await this.removeFromCart(item.product.id);
                }
            }
            
            // Limpiar localStorage
            localStorage.removeItem('cart');
            this.cart = { items: [] };
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}

export const cartService = new CartService(); 