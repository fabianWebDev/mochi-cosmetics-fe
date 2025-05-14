import { Link } from 'react-router-dom';
import Button from '../../ui/common/Button';
import styles from './OrderActionButtons.module.css';

const OrderActionButtons = () => (
    <div className={`${styles.action_buttons} mt-3`}>
        <Link to="/products" className={styles.continue_button}>
            <Button>Continue Shopping</Button>
        </Link>
        <Link to="/orders" className={styles.view_orders_button}>
            <Button variant="secondary">View All Orders</Button>
        </Link>
    </div>
);

export default OrderActionButtons; 