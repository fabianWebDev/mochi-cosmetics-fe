import React from 'react';
import styles from './OrderInfo.module.css';

const OrderInfo = ({ orderDetails, onCancelClick, canCancelOrder }) => {
    return (
        <div className={styles.order_info_container}>
            <p className={styles.order_info_item}>
                <span className={styles.order_info_label}>Status:</span>
                {orderDetails.status}
            </p>
            <p className={styles.order_info_item}>
                <span className={styles.order_info_label}>Total:</span>
                ${orderDetails.total_price}
            </p>
            <p className={styles.order_info_item}>
                <span className={styles.order_info_label}>Date:</span>
                {new Date(orderDetails.created_at).toLocaleDateString()}
            </p>
            {canCancelOrder && (
                <button 
                    className="btn btn-danger"
                    onClick={onCancelClick}
                >
                    Cancel Order
                </button>
            )}
        </div>
    );
};

export default OrderInfo; 