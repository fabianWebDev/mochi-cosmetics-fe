import React from 'react';
import classes from './PaymentMethod.module.css';
import Button from '../ui/common/Button';

const PaymentMethod = ({ onBack, onSubmit }) => {
    return (
        <div className={classes.payment_method}>
            <h3>Payment Method</h3>
            <div className={classes.payment_info}>
                <p>Currently, the only payment method available is SINPE Móvil.</p>
            </div>
            <div className={classes.button_group}>
                <Button onClick={onBack}>Back</Button>
                <Button onClick={onSubmit}>Place Order</Button>
            </div>
        </div>
    );
};

export default PaymentMethod; 