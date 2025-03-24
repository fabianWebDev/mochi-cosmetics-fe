import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                // Cargar carrito usando el servicio
                const cartItems = cartService.getCartItems();
                setCart({ items: cartItems });

                // Intentar sincronizar con el backend si el usuario está autenticado
                if (authService.isAuthenticated()) {
                    try {
                        await cartService.syncWithBackend();
                        setCart({ items: cartService.getCartItems() });
                    } catch (error) {
                        console.error('Error syncing cart with backend:', error);
                        // Si hay error de autenticación, redirigir al login
                        if (error.response?.status === 401) {
                            toast.error('Session expired. Please login again.');
                            navigate('/login');
                            return;
                        }
                        // Para otros errores, mantener el carrito local
                        toast.error('Error syncing cart with server. Using local cart.');
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading cart:', error);
                // En caso de error, asegurarnos de mostrar el carrito local
                const cartItems = cartService.getCartItems();
                setCart({ items: cartItems });
                setLoading(false);
            }
        };

        loadCart();
    }, [navigate]);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                await cartService.removeFromCart(productId);
                toast.success('Item removed from cart');
            } else {
                await cartService.updateQuantity(productId, newQuantity);
                toast.success('Cart updated successfully');
            }

            // Actualizar el estado del carrito
            setCart({ items: cartService.getCartItems() });
        } catch (error) {
            console.error('Error updating cart:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
                return;
            }
            toast.error('Error updating cart');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            setCart({ items: cartService.getCartItems() });
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
                return;
            }
            toast.error('Error removing item from cart');
        }
    };

    const handleCheckout = () => {
        if (authService.isAuthenticated()) {
            navigate('/checkout');
        } else {
            toast.info('Please log in to proceed with checkout');
            navigate('/login');
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mt-4">
                <h1 className="mb-4">Shopping Cart</h1>
                <div className="alert alert-info">
                    Your cart is empty. <Link to="/products" className="alert-link">Continue shopping</Link>
                </div>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.items.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        );
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Shopping Cart</h1>
            {!authService.isAuthenticated() && (
                <div className="alert alert-warning">
                    <i className="bi bi-info-circle me-2"></i>
                    Please <Link to="/login" className="alert-link">log in</Link> to save your cart and proceed with checkout.
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    {cart.items.map((item) => (
                        <div key={item.product.id} className="row mb-4 align-items-center">
                            <div className="col-md-2">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="img-fluid rounded"
                                />
                            </div>
                            <div className="col-md-4">
                                <h5>{item.product.name}</h5>
                                <p className="text-muted mb-0">${item.product.price}</p>
                            </div>
                            <div className="col-md-3">
                                <div className="input-group">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="form-control text-center"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                                        min="1"
                                        max={item.product.stock}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <p className="h5 mb-0">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="col-md-1">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleRemoveItem(item.product.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <h4>Total: ${calculateTotal().toFixed(2)}</h4>
                        <button
                            className="btn btn-primary"
                            onClick={handleCheckout}
                        >
                            {authService.isAuthenticated() ? 'Proceed to Checkout' : 'Log in to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 