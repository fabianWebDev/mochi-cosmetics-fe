import styles from './PaymentInfo.module.css';
import { storeConfig } from '../../../config/storeConfig';

const PaymentInfo = () => {
    return (
        <div className={styles.payment_info}>
            <p>Please make the payment to the bank account below:</p>
            <p>Bank: BDO</p>
            <p>Account Number: 1234567890</p>
            <p>Account Name: John Doe</p>
            <p>Once the payment is made, please send the proof of payment with your order # to our WhatsApp:</p>
            <a href={`https://wa.me/${storeConfig.whatsappNumber}`}>WhatsApp</a>
        </div>
    );
};

export default PaymentInfo;
