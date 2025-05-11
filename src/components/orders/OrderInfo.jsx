import React from 'react';
import styles from './OrderInfo.module.css';
import Button from '../ui/common/Button';
import OrderProducts from './OrderProducts';

const OrderInfo = ({ orderDetails, onCancelClick, canCancelOrder }) => {
    return (
        <div className={styles.order_info_container}>
            <h1 className={`${styles.order_detail_title} custom_h1 mb-3`}>
                Order Details - ID: {orderDetails.order_id}
            </h1>
            <div className="row">
                <div className="col-3">
                    <p className={styles.order_info_item}>
                        <span className={styles.order_info_label}>Status</span>
                    </p>
                    {orderDetails.status}
                </div>
                <div className="col-3">
                    <p className={styles.order_info_item}>
                        <span className={styles.order_info_label}>Total</span>
                    </p>
                    ${orderDetails.total_price}
                </div>
                <div className="col-3">
                    <p className={styles.order_info_item}>
                        <span className={styles.order_info_label}>Date</span>
                    </p>
                    {new Date(orderDetails.created_at).toLocaleDateString()}
                </div>
            </div>
            <OrderProducts items={orderDetails.items} />
            {canCancelOrder && (
                <div className="col-6 col-md-3 mt-2">
                    <Button
                        className={styles.order_cancel_button}
                        onClick={onCancelClick}
                    >
                        Cancel Order
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrderInfo; 