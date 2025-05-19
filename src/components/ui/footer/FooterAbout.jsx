import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const FooterAbout = ({ className }) => {
    return (
        <div className={className}>
            <h3>About us</h3>
            <ul>
                <li>
                    <Link to="/about" className={styles.footer_link}>About us</Link>
                </li>
            </ul>
        </div>
    )
}

export default FooterAbout;
