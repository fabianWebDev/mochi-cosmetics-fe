import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

export const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartItems = cartService.getCartItems();
                setCart({ items: cartItems });

                if (authService.isAuthenticated()) {
                    try {
                        await cartService.syncWithBackend();
                        setCart({ items: cartService.getCartItems() });
                    } catch (error) {
                        console.error('Error syncing cart with backend:', error);
                        if (error.response?.status === 401) {
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

    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                await cartService.removeFromCart(productId);
                toast.success('Item removed from cart');
            } else {
                await cartService.updateQuantity(productId, quantity);
                toast.success('Cart updated successfully');
            }
            setCart({ items: cartService.getCartItems() });
        } catch (error) {
            handleAuthError(error);
        }
    };

    const removeItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            setCart({ items: cartService.getCartItems() });
            toast.success('Item removed from cart');
        } catch (error) {
            handleAuthError(error);
        }
    };

    const handleAuthError = (error) => {
        console.error('Cart error:', error);
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
        }
        toast.error('Something went wrong with the cart.');
    };

    const calculateTotal = () =>
        cart?.items.reduce((total, item) =>
            total + item.product.price * item.quantity, 0
        ) || 0;

    const handleCheckout = () => {
        if (authService.isAuthenticated()) {
            navigate('/checkout');
        } else {
            toast.info('Please log in to proceed with checkout');
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