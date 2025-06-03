import React from 'react';
import classes from './CheckoutSidebar.module.css';

const formatPrice = (price) => {
    if (typeof price !== 'number') {
        price = parseFloat(price);
    }
    return isNaN(price) ? '0.00' : price.toFixed(2);
};

const getShippingMethodName = (methodId, shippingMethods) => {
    const method = shippingMethods.find(m => m.id.toString() === methodId);
    return method ? method.name : 'Select shipping method';
};

const CheckoutSidebar = ({ cart, calculateTotal, calculateSubtotal, calculateShippingCost, shippingInfo, shippingMethods }) => {
    if (!cart || !cart.items) return null;

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = calculateShippingCost();
    const subtotal = calculateSubtotal();

    return (
        <div className={classes.sidebar}>
            <div className={classes.body}>
                <h5>Order Summary</h5>
                <div className={classes.items_summary}>
                    <div className={classes.items_info}>
                        <h6>Items ({totalItems})</h6>
                        <small>{cart.items.length} different products</small>
                    </div>
                    <div className={classes.price}>
                        ${formatPrice(subtotal)}
                    </div>
                </div>
                <hr className={classes.divider} />
                <div className={classes.price_row}>
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div className={classes.price_row}>
                    <div className={classes.shipping_info}>
                        <span>Shipping</span>
                        <small className={classes.shipping_method}>
                            {getShippingMethodName(shippingInfo.shipping_method, shippingMethods)}
                        </small>
                    </div>
                    <span>${formatPrice(shippingCost)}</span>
                </div>
                <hr className={classes.divider} />
                <div className={classes.total_row}>
                    <span>Total</span>
                    <span>${formatPrice(calculateTotal())}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSidebar; 