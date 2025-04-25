import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import styles from './OrderDetail.module.css';

const OrderDetal = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await orderService.getOrderById(orderId);
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="row justify-content-center mt-3">
                <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                    <div className={styles.loading_container}>
                        <h6 className={styles.loading_text}>Loading order details...</h6>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="row justify-content-center mt-3">
                <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                    <div className={styles.not_found_container}>
                        <h6>Order not found.</h6>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row justify-content-center mt-3">
            <div className={`${styles.order_detail_container} col-12 col-md-8 col-lg-8 col-xl-8`}>
                <h1 className={`${styles.order_detail_title} custom_h1 mb-3`}>
                    Order Details - ID: {orderDetails.order_id}
                </h1>
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
                    <h6 className={styles.order_info_label}>
                        Products:
                    </h6>
                    <ul className={styles.products_list}>
                        {orderDetails.items.map((item) => (
                            <li key={item.product_id} className={styles.product_item}>
                                {item.product_name} - Quantity: {item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderDetal;
