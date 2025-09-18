import styles from './OrderHeader.module.css';
import PaymentInfo from './PaymentInfo';

const OrderHeader = ({ orderId, isConfirmation = false }) => (
    <div className={styles.order_header}>
        {isConfirmation ? (
            <>
                <i className={`bi bi-check-circle ${styles.success_icon}`}></i>
                <h1>Thank You for Your Order!</h1>
                <PaymentInfo />
            </>
        ) : (
            <h1>Order Information</h1>
        )}
        <p><strong>Order #{orderId}</strong></p>
    </div>
);

export default OrderHeader; 