import React from 'react';

const OrderSummary = ({ cart, onBack, onNext }) => {
    const calculateTotal = () => {
        return cart?.items.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        ) || 0;
    };

    return (
        <div>
            <h3>Order Summary</h3>
            {cart?.items.map((item) => (
                <div key={item.product.id} className="d-flex justify-content-between mb-2">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
            <div className="mt-3">
                <button onClick={onBack} className="btn btn-secondary me-2">Back</button>
                <button onClick={onNext} className="btn btn-primary">Next</button>
            </div>
        </div>
    );
};

export default OrderSummary; 