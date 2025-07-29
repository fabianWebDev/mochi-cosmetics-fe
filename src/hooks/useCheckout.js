/**
 * Checkout Process Hook
 * 
 * This hook provides a React-friendly interface for managing the checkout process.
 * It handles multi-step checkout flow, shipping information validation, order creation,
 * and integration with cart and order services. The hook manages the complete
 * checkout experience from cart validation to order confirmation.
 * 
 * Key Features:
 * - Multi-step checkout process management
 * - Shipping information validation and management
 * - Order creation and processing
 * - Cart validation and stock management
 * - Shipping methods integration
 * - Price calculations (subtotal, shipping, tax, total)
 * - Error handling with toast notifications
 * - Authentication verification
 * 
 * @module useCheckout
 * @requires react - React hooks for state management
 * @requires react-router-dom - Navigation functionality
 * @requires react-toastify - Toast notifications
 * @requires authService - Authentication service for user verification
 * @requires cartService - Cart service for cart operations
 * @requires orderService - Order service for order creation and management
 * @requires Checkout - Checkout components and utilities
 * @requires shippingValidationSchema - Validation schema for shipping information
 * @requires validateCart - Cart validation utility
 * 
 * @example
 * import { useCheckout } from '../hooks/useCheckout';
 * 
 * function CheckoutPage() {
 *   const {
 *     cart,
 *     loading,
 *     currentStep,
 *     shippingInfo,
 *     shippingMethods,
 *     handleInputChange,
 *     handleNextStep,
 *     handleSubmit,
 *     calculateTotal
 *   } = useCheckout();
 * 
 *   if (loading) return <div>Loading checkout...</div>; // Example loading state
 * 
 *   // Example JSX structure (commented for linter compatibility)
 *   // return (
 *   //   <form onSubmit={handleSubmit}>
 *   //     <input
 *   //       name="full_name"
 *   //       value={shippingInfo.full_name}
 *   //       onChange={handleInputChange}
 *   //     />
 *   //     <button type="button" onClick={handleNextStep}>
 *   //       Next Step
 *   //     </button>
 *   //     <div>Total: ${calculateTotal()}</div>
 *   //   </form>
 *   // );
 * }
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { Checkout } from '../components';
const { ORDER_STATUS, INITIAL_SHIPPING_INFO } = Checkout;
const { handleCheckoutError } = Checkout;
import { shippingValidationSchema, validateCart } from '../components/checkout/utils';

// Update INITIAL_SHIPPING_INFO to include shipping_method
const updatedInitialShippingInfo = {
    ...INITIAL_SHIPPING_INFO,
    shipping_method: ''
};

/**
 * Parses and validates price values from various formats
 * 
 * This utility function handles price parsing from different data types,
 * ensuring consistent numeric values for calculations. It handles string
 * prices with currency symbols and formatting characters.
 * 
 * @param {string|number} price - The price value to parse
 * @returns {number} The parsed price as a number, 0 if invalid
 * 
 * @example
 * parsePrice('$19.99'); // Returns 19.99
 * parsePrice(25.50);    // Returns 25.50
 * parsePrice('invalid'); // Returns 0
 */
const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const cleanPrice = price.replace(/[^0-9.-]+/g, '');
        const parsed = parseFloat(cleanPrice);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

/**
 * Custom hook for managing the checkout process
 * 
 * This hook provides a comprehensive interface for the checkout process,
 * including multi-step navigation, shipping information management,
 * order creation, and integration with various services. It handles
 * the complete flow from cart validation to order confirmation.
 * 
 * @returns {Object} Checkout state and methods
 * @returns {Object|null} returns.cart - Current cart object with items
 * @returns {boolean} returns.loading - Whether checkout is initializing
 * @returns {number} returns.currentStep - Current step in checkout process (1-3)
 * @returns {Object} returns.shippingInfo - Shipping information form data
 * @returns {Array} returns.shippingMethods - Available shipping methods
 * @returns {Function} returns.handleInputChange - Function to handle form input changes
 * @returns {Function} returns.handleNextStep - Function to proceed to next step
 * @returns {Function} returns.handleSubmit - Function to submit the order
 * @returns {Function} returns.setCurrentStep - Function to set current step
 * @returns {Function} returns.calculateTotal - Function to calculate order total
 * @returns {Function} returns.calculateSubtotal - Function to calculate subtotal
 * @returns {Function} returns.calculateShippingCost - Function to calculate shipping cost
 * 
 * @example
 * const {
 *   cart,
 *   loading,
 *   currentStep,
 *   shippingInfo,
 *   shippingMethods,
 *   handleInputChange,
 *   handleNextStep,
 *   handleSubmit,
 *   calculateTotal
 * } = useCheckout();
 * 
 * // Handle form input changes
 * const handleNameChange = (e) => {
 *   handleInputChange(e);
 * };
 * 
 * // Navigate to next step
 * const goToNextStep = () => {
 *   handleNextStep();
 * };
 * 
 * // Submit order
 * const submitOrder = (e) => {
 *   handleSubmit(e);
 * };
 * 
 * // Calculate costs
 * const total = calculateTotal();
 * console.log('Order total:', total);
 */
export const useCheckout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState(updatedInitialShippingInfo);
    const [userId, setUserId] = useState(null);
    const [shippingMethods, setShippingMethods] = useState([]);

    useEffect(() => {
        /**
         * Initializes the checkout process
         * 
         * This function performs the initial setup for checkout, including
         * authentication verification, user data loading, cart validation,
         * and shipping methods fetching. It ensures all prerequisites
         * are met before allowing checkout to proceed.
         * 
         * @async
         * @returns {Promise<void>}
         */
        const initializeCheckout = async () => {
            // Verify user authentication
            if (!authService.isAuthenticated()) {
                toast.dismiss();
                toast.error('Please login to proceed with checkout');
                navigate('/login');
                return;
            }

            // Load and validate user data
            const user = authService.getUser();
            if (!user || !user.id) {
                toast.dismiss();
                toast.error('Error loading user data');
                navigate('/login');
                return;
            }
            setUserId(user.id);

            // Validate cart has items
            const cartItems = cartService.getCartItems();
            if (!cartItems || cartItems.length === 0) {
                toast.dismiss();
                toast.error('Your cart is empty');
                navigate('/cart');
                return;
            }
            setCart({ items: cartItems });

            // Load shipping methods
            try {
                const methods = await orderService.getShippingMethods();
                setShippingMethods(methods);
            } catch (error) {
                console.error('Error fetching shipping methods:', error);
                toast.error('Error loading shipping methods');
            }

            setLoading(false);
        };

        initializeCheckout();
    }, [navigate]);

    /**
     * Handles form input changes for shipping information
     * 
     * This function updates the shipping information state based on form
     * input changes, supporting both text inputs and checkboxes.
     * 
     * @param {Event} e - The input change event
     * @returns {void}
     * 
     * @example
     * const { handleInputChange } = useCheckout();
     * 
     * // Handle text input
     * // <input
     * //   name="full_name"
     * //   value={shippingInfo.full_name}
     * //   onChange={handleInputChange}
     * // />
     * 
     * // Handle checkbox
     * // <input
     * //   type="checkbox"
     * //   name="save_address"
     * //   checked={shippingInfo.save_address}
     * //   onChange={handleInputChange}
     * // />
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /**
     * Proceeds to the next step in the checkout process
     * 
     * This function validates the current step's data before proceeding
     * to the next step. For step 1, it validates shipping information
     * using the shipping validation schema.
     * 
     * @returns {void}
     * 
     * @example
     * const { handleNextStep, currentStep } = useCheckout();
     * 
     * // Proceed to next step (validates current step first)
     * const goToNext = () => {
     *   handleNextStep();
     * };
     */
    const handleNextStep = () => {
        if (currentStep === 1) {
            try {
                shippingValidationSchema.validateSync(shippingInfo, { abortEarly: false });
            } catch (error) {
                error.inner.forEach(err => {
                    toast.dismiss();
                    toast.error(err.message);
                });
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    /**
     * Calculates the shipping cost based on selected shipping method
     * 
     * This function determines the shipping cost by finding the selected
     * shipping method in the available methods and returning its price.
     * 
     * @returns {number} The shipping cost, 0 if no method selected
     * 
     * @example
     * const { calculateShippingCost, shippingInfo } = useCheckout();
     * 
     * // Get shipping cost
     * const shippingCost = calculateShippingCost();
     * console.log('Shipping cost:', shippingCost);
     */
    const calculateShippingCost = () => {
        if (!shippingInfo.shipping_method) return 0;
        const method = shippingMethods.find(m => m.id.toString() === shippingInfo.shipping_method);
        return method ? parsePrice(method.price) : 0;
    };

    /**
     * Calculates the subtotal of all items in the cart
     * 
     * This function iterates through all cart items and calculates the
     * subtotal by multiplying each item's price by its quantity.
     * 
     * @returns {number} The subtotal of all cart items
     * 
     * @example
     * const { calculateSubtotal } = useCheckout();
     * 
     * // Get subtotal
     * const subtotal = calculateSubtotal();
     * console.log('Subtotal:', subtotal);
     */
    const calculateSubtotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            const itemPrice = parsePrice(item.product.price);
            const quantity = parseInt(item.quantity) || 0;
            return total + (itemPrice * quantity);
        }, 0);
    };

    /**
     * Calculates the total tax for all items in the cart
     * 
     * This function calculates the tax amount for each item based on
     * the product's tax rate and quantity, then sums all tax amounts.
     * 
     * @param {Array} items - Array of cart items
     * @returns {number} The total tax amount
     * 
     * @example
     * const { calculateTotalTax, cart } = useCheckout();
     * 
     * // Calculate total tax
     * const totalTax = calculateTotalTax(cart.items);
     * console.log('Total tax:', totalTax);
     */
    const calculateTotalTax = (items) => {
        return items.reduce((total, item) => {
            const itemTax = item.product.price * item.quantity * ((item.product.tax?.rate || 0) / 100);
            return total + itemTax;
        }, 0);
    };

    /**
     * Calculates the total order amount including subtotal, shipping, and tax
     * 
     * This function combines the subtotal, shipping cost, and tax to
     * provide the final total amount for the order.
     * 
     * @returns {number} The total order amount
     * 
     * @example
     * const { calculateTotal } = useCheckout();
     * 
     * // Get total order amount
     * const total = calculateTotal();
     * console.log('Order total:', total);
     */
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = calculateShippingCost();
        const tax = calculateTotalTax(cart.items);
        return subtotal + shipping + tax;
    };

    /**
     * Submits the order and processes the checkout
     * 
     * This function handles the complete order submission process, including
     * validation of shipping information and cart data, order creation,
     * stock updates, cart clearing, and navigation to order confirmation.
     * 
     * @async
     * @param {Event} e - The form submit event
     * @returns {Promise<void>}
     * 
     * @example
     * const { handleSubmit } = useCheckout();
     * 
     * // Submit order form
     * // <form onSubmit={handleSubmit}>
     * //    // form fields
     * //    <button type="submit">Place Order</button>
     * // </form>
     */

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate shipping information
        try {
            await shippingValidationSchema.validate(shippingInfo, { abortEarly: false });
        } catch (error) {
            error.inner.forEach(err => {
                toast.dismiss();
                toast.error(err.message);
            });
            return;
        }

        // Validate cart data
        const cartErrors = validateCart(cart);
        if (cartErrors.length > 0) {
            cartErrors.forEach(error => {
                toast.dismiss();
                toast.error(error);
            });
            return;
        }

        // Verify user ID is available
        if (!userId) {
            toast.dismiss();
            toast.error('User information not loaded');
            return;
        }

        try {
            // Prepare order data
            const orderData = {
                user: userId,
                status: ORDER_STATUS.PENDING,
                total_price: calculateTotal(),
                shipping_address: shippingInfo.shipping_method === '1'
                    ? 'Store Pickup'
                    : `${shippingInfo.full_name}\n${shippingInfo.exact_address}\n${shippingInfo.district}, ${shippingInfo.canton}, ${shippingInfo.province}\nPhone: ${shippingInfo.shipping_phone}`,
                shipping_method: shippingInfo.shipping_method,
                order_items: cart.items.map(item => {
                    const price = parsePrice(item.product.price);
                    if (isNaN(price) || price === null) {
                        throw new Error(`Invalid price for product ${item.product.name}`);
                    }
                    return {
                        product: item.product.id,
                        quantity: item.quantity,
                        price_at_time: price
                    };
                })
            };

            // Create order
            const order = await orderService.createOrder(orderData);

            if (!order || (!order.order_id && !order.id)) {
                throw new Error('Invalid order response from server');
            }

            const orderId = order.order_id || order.id;

            // Update product stock for each item
            for (const item of cart.items) {
                try {
                    await orderService.updateProductStock(
                        item.product.id,
                        item.product.stock - item.quantity
                    );
                } catch (error) {
                    toast.dismiss();
                    toast.error(`Error updating stock for ${item.product.name}`);
                    await orderService.deleteOrder(orderId);
                    return;
                }
            }

            // Clear cart and navigate to confirmation
            await cartService.clearCart();
            toast.dismiss();
            toast.success('Order placed successfully!');
            navigate(`/order-confirmation/${orderId}`);

        } catch (error) {
            handleCheckoutError(error, navigate);
        }
    };

    return {
        cart,
        loading,
        currentStep,
        shippingInfo,
        shippingMethods,
        handleInputChange,
        handleNextStep,
        handleSubmit,
        setCurrentStep,
        calculateTotal,
        calculateSubtotal,
        calculateShippingCost
    };
}; 