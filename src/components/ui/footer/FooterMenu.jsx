import { Link } from 'react-router-dom';

const FooterMenu = ({ className }) => {
    return (
        <div className={className}>
            <ul>
                <h3>Shop</h3>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/products?search=mtg">Magic the Gathering</Link>
                </li>
                <li>
                    <Link to="/products">Products</Link>
                </li>
            </ul>
        </div>
    )
}

export default FooterMenu;
