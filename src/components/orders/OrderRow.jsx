import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OrderRow.module.css';

const OrderRow = ({ order }) => {
  return (
    <tr className={styles.table_row}>
      <td className={styles.table_cell}>
        <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
          {order.order_id}
        </Link>
      </td>
      <td className={styles.table_cell}>
        <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
          {new Date(order.created_at).toLocaleDateString()}
        </Link>
      </td>
      <td className={styles.table_cell}>
        <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
          ${order.total_price}
        </Link>
      </td>
      <td className={styles.table_cell}>
        <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
          {order.status}
        </Link>
      </td>
    </tr>
  );
};

export default OrderRow; 