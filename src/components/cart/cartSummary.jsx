import React from 'react';
import classes from '../../styles/CartSummary.module.css';

const CartSummary = ({ total, onCheckout, isAuthenticated }) => (
    <div className="d-flex justify-content-between align-items-center">
        <h4>Total: ${total.toFixed(2)}</h4>
        <button className={`${classes.cart_summary_button} mt-2`} onClick={onCheckout}>
            {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
        </button>
    </div>
);


export default CartSummary;
