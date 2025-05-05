import React from 'react';
import Button from '../ui/common/Button';

const CartSummary = ({ total, onCheckout, isAuthenticated }) => (
    <div className="d-flex justify-content-between align-items-center mt-2">
        <div className="d-flex flex-column">
            <h4>Total: ${total.toFixed(2)}</h4>
        </div>
        <div className="d-flex flex-column">
            <Button onClick={onCheckout}>
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </Button>
        </div>
    </div>
);

export default CartSummary;
