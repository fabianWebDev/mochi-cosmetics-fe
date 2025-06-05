import React from 'react';
import styles from './OrdersTable.module.css';
import OrderRow from './OrderRow';

const OrdersTable = ({ orders }) => {
    return (
        <div className={styles.table_container}>
            <h1 className="custom_h1 mb-3">Order History</h1>
            <table className={styles.table}>
                <thead className={styles.table_header}>
                    <tr>
                        <th className={styles.table_header_cell}>Order ID</th>
                        <th className={styles.table_header_cell}>Date</th>
                        <th className={styles.table_header_cell}>Total</th>
                        <th className={styles.table_header_cell}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr key="no-orders">
                            <td colSpan="4" className={styles.empty_orders}>
                                No orders to display
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <OrderRow 
                                key={order.id} 
                                order={order} 
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable; 