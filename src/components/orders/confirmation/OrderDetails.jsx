import styles from './OrderDetails.module.css';

const OrderDetails = ({ order }) => (
    <div className={styles.order_details}>
        <h3 className={styles.section_title}>Order Details</h3>
        <p><strong>Order Status:</strong> {order.status}</p>
        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ${Number(order.total_price).toFixed(2)}</p>
    </div>
);

export default OrderDetails; 