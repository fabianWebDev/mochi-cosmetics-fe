import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { ORDER_STATUS, INITIAL_SHIPPING_INFO } from '../components/checkout/constants';
import { validateShippingInfo, validateCart } from '../components/checkout/validations';
import { handleCheckoutError } from '../components/checkout/errorHandler';

export const useCheckout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState(INITIAL_SHIPPING_INFO);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
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
        setLoading(false);
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
            if (!shippingInfo.pickup) {
                const errors = validateShippingInfo(shippingInfo);
                if (errors.length > 0) {
                    errors.forEach(error => {
                        toast.dismiss();
                        toast.error(error);
                    });
                    return;
                }
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        ) || 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shippingErrors = validateShippingInfo(shippingInfo);
        if (shippingErrors.length > 0) {
            shippingErrors.forEach(error => {
                toast.dismiss();
                toast.error(error);
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
                shipping_address: shippingInfo.pickup
                    ? 'Pick up in store'
                    : `${shippingInfo.full_name}\n${shippingInfo.exact_address}\n${shippingInfo.district}, ${shippingInfo.canton}, ${shippingInfo.province}\nPhone: ${shippingInfo.shipping_phone}`,
                items: cart.items.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price_at_time: item.product.price
                }))
            };

            const order = await orderService.createOrder(orderData);

            if (!order || !order.order_id) {
                throw new Error('Invalid order response from server');
            }

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
                    await orderService.deleteOrder(order.order_id);
                    return;
                }
            }

            await cartService.clearCart();
            toast.dismiss();
            toast.success('Order placed successfully!');
            navigate(`/order-confirmation/${order.order_id}`);

        } catch (error) {
            handleCheckoutError(error, navigate);
        }
    };

    return {
        cart,
        loading,
        currentStep,
        shippingInfo,
        handleInputChange,
        handleNextStep,
        handleSubmit,
        setCurrentStep,
        calculateTotal
    };
}; 