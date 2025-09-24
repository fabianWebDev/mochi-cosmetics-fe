import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { storeConfig } from '../../../config/storeConfig';

const FooterMenu = ({ className }) => {
    return (
        <div className={className}>
            <ul>
                <h3>Shop</h3>
                <li>
                    <Link to="/" className={styles.footer_link}>Home</Link>
                </li>
                <li>
                    <Link to={`/products?category=${storeConfig.mainCategory}`} className={styles.footer_link}>{storeConfig.mainCategoryName}</Link>
                </li>
                <li>
                    <Link to="/products" className={styles.footer_link}>Products</Link>
                </li>
            </ul>
        </div>
    )
}

export default FooterMenu;
