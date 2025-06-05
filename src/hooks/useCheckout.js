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

const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        // Remove any currency symbols and commas
        const cleanPrice = price.replace(/[^0-9.-]+/g, '');
        const parsed = parseFloat(cleanPrice);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

export const useCheckout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState(updatedInitialShippingInfo);
    const [userId, setUserId] = useState(null);
    const [shippingMethods, setShippingMethods] = useState([]);

    useEffect(() => {
        const initializeCheckout = async () => {
            if (!authService.isAuthenticated()) {
                toast.dismiss();
                toast.error('Please login to proceed with checkout');
                navigate('/login');
                return;
            }

            const user = authService.getUser();
            if (!user || !user.id) {
                toast.dismiss();
                toast.error('Error loading user data');
                navigate('/login');
                return;
            }
            setUserId(user.id);

            const cartItems = cartService.getCartItems();
            if (!cartItems || cartItems.length === 0) {
                toast.dismiss();
                toast.error('Your cart is empty');
                navigate('/cart');
                return;
            }
            setCart({ items: cartItems });

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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

    const calculateShippingCost = () => {
        if (!shippingInfo.shipping_method) return 0;
        const method = shippingMethods.find(m => m.id.toString() === shippingInfo.shipping_method);
        return method ? parsePrice(method.price) : 0;
    };

    const calculateSubtotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            const itemPrice = parsePrice(item.product.price);
            const quantity = parseInt(item.quantity) || 0;
            return total + (itemPrice * quantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = calculateShippingCost();
        return subtotal + shipping;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await shippingValidationSchema.validate(shippingInfo, { abortEarly: false });
        } catch (error) {
            error.inner.forEach(err => {
                toast.dismiss();
                toast.error(err.message);
            });
            return;
        }

        const cartErrors = validateCart(cart);
        if (cartErrors.length > 0) {
            cartErrors.forEach(error => {
                toast.dismiss();
                toast.error(error);
            });
            return;
        }

        if (!userId) {
            toast.dismiss();
            toast.error('User information not loaded');
            return;
        }

        try {
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

            console.log('Sending order data:', JSON.stringify(orderData, null, 2));

            const order = await orderService.createOrder(orderData);

            if (!order || (!order.order_id && !order.id)) {
                throw new Error('Invalid order response from server');
            }

            const orderId = order.order_id || order.id;

            for (const item of cart.items) {
                try {
                    await orderService.updateProductStock(
                        item.product.id,
                        item.quantity,
                        'decrease'
                    );
                } catch (error) {
                    toast.dismiss();
                    toast.error(`Error updating stock for ${item.product.name}`);
                    await orderService.deleteOrder(orderId);
                    return;
                }
            }

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