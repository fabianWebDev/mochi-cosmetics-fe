/**
 * Shopping Cart Hook
 * 
 * This hook provides a React-friendly interface for managing shopping cart state.
 * It wraps the cartService and provides reactive state management with automatic
 * synchronization between local storage and backend server when user is authenticated.
 * 
 * Key Features:
 * - Reactive cart state management
 * - Local storage persistence
 * - Backend synchronization for authenticated users
 * - Quantity updates and item removal
 * - Total calculation
 * - Checkout flow integration
 * - Error handling with toast notifications
 * 
 * @module useCart
 * @requires react - React hooks for state management
 * @requires react-router-dom - Navigation functionality
 * @requires react-toastify - Toast notifications
 * @requires cartService - Cart service for API calls and storage
 * @requires authService - Authentication service for user status
 * 
 * @example
 * import { useCart } from '../hooks/useCart';
 * 
 * function CartComponent() {
 *   const { cart, loading, updateQuantity, removeItem, calculateTotal } = useCart();
 * 
 *   if (loading) return <div>Loading cart...</div>;
 * 
 *   return (
 *     <div>
 *       {cart.items.map(item => (
 *         <div key={item.product.id}>
 *           {item.product.name} - Quantity: {item.quantity}
 *           <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
 *             +
 *           </button>
 *         </div>
 *       ))}
 *       <div>Total: ${calculateTotal()}</div>
 *     </div>
 *   );
 * }
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

/**
 * Custom hook for managing shopping cart state
 * 
 * This hook provides a reactive interface to the shopping cart system,
 * automatically loading cart items from local storage and synchronizing
 * with the backend server when the user is authenticated. It includes
 * methods for updating quantities, removing items, calculating totals,
 * and handling checkout flow.
 * 
 * @returns {Object} Cart state and methods
 * @returns {Object|null} returns.cart - Current cart object with items array or null if loading
 * @returns {boolean} returns.loading - Whether the cart is currently loading
 * @returns {Function} returns.updateQuantity - Function to update item quantity
 * @returns {Function} returns.removeItem - Function to remove item from cart
 * @returns {Function} returns.calculateTotal - Function to calculate cart total
 * @returns {Function} returns.handleCheckout - Function to initiate checkout
 * @returns {boolean} returns.isAuthenticated - Whether the user is authenticated
 * 
 * @example
 * const { cart, loading, updateQuantity, removeItem, calculateTotal, handleCheckout } = useCart();
 * 
 * // Check if cart is loading
 * if (loading) {
 *   return <div>Loading cart...</div>;
 * }
 * 
 * // Update item quantity
 * const handleQuantityChange = (productId, newQuantity) => {
 *   updateQuantity(productId, newQuantity);
 * };
 * 
 * // Remove item from cart
 * const handleRemoveItem = (productId) => {
 *   removeItem(productId);
 * };
 * 
 * // Calculate and display total
 * const total = calculateTotal();
 * console.log('Cart total:', total);
 * 
 * // Handle checkout
 * const handleCheckoutClick = () => {
 *   handleCheckout();
 * };
 */
export const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Loads cart items from local storage and synchronizes with backend
         * 
         * This function initializes the cart by loading items from local storage
         * and, if the user is authenticated, attempts to sync with the backend
         * server to ensure consistency across devices.
         * 
         * @async
         * @returns {Promise<void>}
         */
        const loadCart = async () => {
            try {
                // Load cart items from local storage
                const cartItems = cartService.getCartItems();
                setCart({ items: cartItems });

                // If user is authenticated, sync with backend
                if (authService.isAuthenticated()) {
                    try {
                        await cartService.syncWithBackend();
                        setCart({ items: cartService.getCartItems() });
                    } catch (error) {
                        console.error('Error syncing cart with backend:', error);
                        if (error.response?.status === 401) {
                            toast.dismiss();
                            toast.error('Session expired. Please login again.');
                            navigate('/login');
                            return;
                        }
                        toast.error('Error syncing cart with server. Using local cart.');
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading cart:', error);
                setCart({ items: cartService.getCartItems() });
                setLoading(false);
            }
        };

        loadCart();
    }, [navigate]);

    /**
     * Updates the quantity of an item in the cart
     * 
     * This function updates the quantity of a specific product in the cart.
     * If the quantity is 0 or negative, the item is removed from the cart.
     * The function handles both local storage updates and backend synchronization
     * for authenticated users.
     * 
     * @async
     * @param {string|number} productId - The ID of the product to update
     * @param {number} quantity - The new quantity (0 or negative removes the item)
     * @returns {Promise<void>}
     * 
     * @example
     * const { updateQuantity } = useCart();
     * 
     * // Increase quantity by 1
     * await updateQuantity('product123', 3);
     * 
     * // Remove item by setting quantity to 0
     * await updateQuantity('product123', 0);
     */
    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                await cartService.removeFromCart(productId);
                toast.dismiss();
                toast.success('Item removed from cart');
            } else {
                await cartService.updateQuantity(productId, quantity);
                toast.dismiss();
                toast.success('Cart updated successfully');
            }
            setCart({ items: cartService.getCartItems() });
        } catch (error) {
            handleAuthError(error);
        }
    };

    /**
     * Removes an item from the cart
     * 
     * This function completely removes a product from the cart, regardless
     * of its current quantity. It handles both local storage updates and
     * backend synchronization for authenticated users.
     * 
     * @async
     * @param {string|number} productId - The ID of the product to remove
     * @returns {Promise<void>}
     * 
     * @example
     * const { removeItem } = useCart();
     * 
     * // Remove a specific product from cart
     * await removeItem('product123');
     */
    const removeItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            setCart({ items: cartService.getCartItems() });
            toast.dismiss();
            toast.success('Item removed from cart');
        } catch (error) {
            handleAuthError(error);
        }
    };

    /**
     * Handles authentication errors during cart operations
     * 
     * This function processes errors that occur during cart operations,
     * specifically handling 401 unauthorized errors by redirecting to login
     * and showing appropriate error messages to the user.
     * 
     * @param {Error} error - The error object from the failed operation
     * @returns {void}
     */
    const handleAuthError = (error) => {
        console.error('Cart error:', error);
        if (error.response?.status === 401) {
            toast.dismiss();
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
        }
        toast.dismiss();
        toast.error('Something went wrong with the cart.');
    };

    /**
     * Calculates the total price of all items in the cart
     * 
     * This function iterates through all cart items and calculates the
     * total price by multiplying each item's price by its quantity.
     * 
     * @returns {number} The total price of all items in the cart
     * 
     * @example
     * const { calculateTotal } = useCart();
     * 
     * // Get cart total
     * const total = calculateTotal();
     * console.log('Cart total: $', total.toFixed(2));
     */
    const calculateTotal = () =>
        cart?.items.reduce((total, item) =>
            total + item.product.price * item.quantity, 0
        ) || 0;

    /**
     * Initiates the checkout process
     * 
     * This function checks if the user is authenticated before proceeding
     * to checkout. If authenticated, it navigates to the checkout page.
     * If not authenticated, it shows a message and redirects to login.
     * 
     * @returns {void}
     * 
     * @example
     * const { handleCheckout } = useCart();
     * 
     * // Handle checkout button click
     * const onCheckoutClick = () => {
     *   handleCheckout();
     * };
     */
    const handleCheckout = () => {
        if (authService.isAuthenticated()) {
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    return {
        cart,
        loading,
        updateQuantity,
        removeItem,
        calculateTotal,
        handleCheckout,
        isAuthenticated: authService.isAuthenticated()
    };
};