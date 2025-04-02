import React from 'react';

const PaymentMethod = ({ onBack, onSubmit }) => {
    return (
        <div>
            <h3>Payment Method</h3>
            <p>Currently, the only payment method available is SINPE Móvil.</p>
            <div className="mt-3">
                <button onClick={onBack} className="btn btn-secondary me-2">Back</button>
                <button onClick={onSubmit} className="btn btn-primary">Place Order</button>
            </div>
        </div>
    );
};

export default PaymentMethod; 