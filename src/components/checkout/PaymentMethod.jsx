import React from 'react';
import classes from '../../styles/PaymentMethod.module.css';

const PaymentMethod = ({ onBack, onSubmit }) => {
    return (
        <div className={classes.payment_method}>
            <h3>Payment Method</h3>
            <div className={classes.payment_info}>
                <p>Currently, the only payment method available is SINPE Móvil.</p>
            </div>
            <div className={classes.button_group}>
                <button onClick={onBack} className={classes.back_button}>Back</button>
                <button onClick={onSubmit} className={classes.place_order_button}>Place Order</button>
            </div>
        </div>
    );
};

export default PaymentMethod; 