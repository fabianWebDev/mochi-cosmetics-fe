import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FooterContactUs = ({ className }) => {
    return (
        <div className={className}>
            <ul>
                <h3>Contact us</h3>
                <li>
                    <Link to="https://wa.me/50683751695" target="_blank" className={styles.footer_link}>WhatsApp: +506 83751695</Link>
                </li>
                <li>
                    <Link to="mailto:minasmorgulstore@gmail.com" target="_blank" className={styles.footer_link}>Email: minasmorgulstore@gmail.com</Link>
                </li>
            </ul>
        </div>
    )
}

export default FooterContactUs;
