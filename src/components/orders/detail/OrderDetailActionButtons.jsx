import Button from '../../ui/common/Button';
import styles from './OrderDetailActionButtons.module.css';

const OrderDetailActionButtons = ({ onCancelClick, canCancelOrder }) => (
    <div className={`${styles.action_buttons} mt-3 col-12 col-md-8 col-lg-4 col-xl-4`}>
        {canCancelOrder && (
            <Button 
                variant="danger" 
                onClick={onCancelClick}
                className={styles.cancel_button}
            >
                Cancel Order
            </Button>
        )}
    </div>
);

export default OrderDetailActionButtons;
