
import Button from '../../ui/common/Button';
import styles from './OrderActionButtons.module.css';
import { useNavigate } from 'react-router-dom';

const OrderActionButtons = () => {
    const navigate = useNavigate();
    return (
        <div className={`${styles.action_buttons} col-12 col-md-8 col-lg-6 col-xl-6`}>
            <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            <Button variant="secondary" onClick={() => navigate('/orders')}>View All Orders</Button>
        </div>
    );
};

export default OrderActionButtons; 