import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/cartItem';
import CartSummary from '../components/cart/cartSummary';

const Cart = () => {
    const {
        cart,
        loading,
        updateQuantity,
        removeItem,
        calculateTotal,
        handleCheckout,
        isAuthenticated
    } = useCart();

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

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Shopping Cart</h1>
            {!isAuthenticated && (
                <div className="alert alert-warning">
                    <i className="bi bi-info-circle me-2"></i>
                    Please <Link to="/login" className="alert-link">log in</Link> to save your cart and proceed with checkout.
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    {cart.items.map(item => (
                        <CartItem
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                        />
                    ))}
                    <hr />
                    <CartSummary
                        total={calculateTotal()}
                        onCheckout={handleCheckout}
                        isAuthenticated={isAuthenticated}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cart;