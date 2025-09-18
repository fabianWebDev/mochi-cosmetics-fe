import React from 'react';
import classes from './PaymentMethod.module.css';
import Button from '../ui/common/Button';

const PaymentMethod = ({ onBack, onSubmit }) => {
    return (
        <div className={classes.payment_method}>
            <h1 className="custom_h1 mb-3">Payment Method</h1>
            <div className="mb-2">
                <p>Currently, the only payment method available is bank transfer.</p>
            </div>
            <div className={classes.button_group}>
                <Button onClick={onBack} variant="secondary">Back</Button>
                <Button onClick={onSubmit}>Place Order</Button>
            </div>
        </div>
    );
};

export default PaymentMethod; 