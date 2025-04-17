import React from 'react';
import classes from './OrderSummary.module.css';

const OrderSummary = ({ cart, onBack, onNext }) => {
    const calculateTotal = () => {
        return cart?.items.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        ) || 0;
    };

    return (
        <div className={classes.order_summary}>
            <h3>Order Summary</h3>
            <div className={classes.order_items}>
                {cart?.items.map((item) => (
                    <div key={item.product.id} className={classes.order_item}>
                        <span className={classes.item_name}>{item.product.name} x {item.quantity}</span>
                        <span className={classes.item_price}>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className={classes.total}>
                <span className={classes.total_label}>Total</span>
                <span className={classes.total_amount}>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className={classes.button_group}>
                <button onClick={onBack} className={classes.back_button}>Back</button>
                <button onClick={onNext} className={classes.next_button}>Next</button>
            </div>
        </div>
    );
};

export default OrderSummary; 