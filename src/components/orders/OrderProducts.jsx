import React from 'react';
import styles from './OrderProducts.module.css';

const OrderProducts = ({ items }) => {
    return (
        <>
            <h6 className={`${styles.order_info_label} mt-2`}>
                Products:
            </h6>
            <ul className={styles.products_list}>
                {items.map((item) => (
                    <li key={item.product} className={styles.product_item}>
                        {item.product_name} - Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default OrderProducts; 