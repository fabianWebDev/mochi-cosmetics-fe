import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const FooterContactUs = ({ className }) => {
    return (
        <div className={className}>
            <ul>
                <h3>Contact us</h3>
                <li>
                    <Link to="/contact" className={styles.footer_link}>Contact form</Link>
                </li>
                
            </ul>
            <Link to="https://wa.me/50683751695" target="_blank">
                    <FontAwesomeIcon icon={faWhatsapp} className={`${styles.footer_social_icon} ${styles.whatsapp_icon}`} />
                </Link>
        </div>
    )
}

export default FooterContactUs;
