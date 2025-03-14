import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                // Intentar sincronizar con el backend si el usuario está autenticado
                await cartService.syncWithBackend();
                
                // Cargar carrito del localStorage
                const cartData = cartService.loadCartFromLocalStorage();
                setCart(cartData);
                setLoading(false);
            } catch (error) {
                // Solo mostrar error toast si no es un 404
                if (!error.response || error.response.status !== 404) {
                    console.error('Error loading cart:', error);
                    toast.error('Error loading cart');
                }
                // En cualquier caso, cargar el carrito local
                const cartData = cartService.loadCartFromLocalStorage();
                setCart(cartData);
                setLoading(false);
            }
        };

        loadCart();
    }, []);

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
            setCart(cartService.loadCartFromLocalStorage());
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Error updating cart');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            setCart(cartService.loadCartFromLocalStorage());
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Error removing item from cart');
        }
    };

    const handleCheckout = () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/checkout');
        } else {
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
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 