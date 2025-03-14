import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get cart from localStorage
        const savedCart = localStorage.getItem('cart');
        setCart(savedCart ? JSON.parse(savedCart) : { items: [] });
        setLoading(false);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
            return;
        }

        setCart(prevCart => {
            const updatedItems = prevCart.items.map(item => 
                item.product.id === productId 
                    ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
                    : item
            );
            return { ...prevCart, items: updatedItems };
        });
        toast.success('Cart updated successfully');
    };

    const handleRemoveItem = (productId) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.filter(item => item.product.id !== productId)
        }));
        toast.success('Item removed from cart');
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
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
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
                        <Link to="/login" className="btn btn-primary">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 