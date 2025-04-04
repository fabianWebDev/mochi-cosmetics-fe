import React from 'react';

const CartSummary = ({ total, onCheckout, isAuthenticated }) => (
    <div className="d-flex justify-content-between align-items-center">
        <h4>Total: ${total.toFixed(2)}</h4>
        <button className="btn btn-primary" onClick={onCheckout}>
            {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
        </button>
    </div>
);

export default CartSummary;
