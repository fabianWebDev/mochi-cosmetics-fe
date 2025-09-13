import styles from './OrderHeader.module.css';

const OrderHeader = ({ orderId, isConfirmation = false }) => (
    <div className={styles.order_header}>
        {isConfirmation ? (
            <>
                <i className={`bi bi-check-circle ${styles.success_icon}`}></i>
                <h1>Thank You for Your Order!</h1>
            </>
        ) : (
            <h1>Order Information</h1>
        )}
        <p>Order #{orderId}</p>
    </div>
);

export default OrderHeader; 