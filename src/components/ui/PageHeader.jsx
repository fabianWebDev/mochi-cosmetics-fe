import { authService } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import classes from '../../styles/PageHeader.module.css';
import logo from '../../assets/logo.png';
import CartIcon from './CartIcon';
import { cartService } from '../../services/cartService';
import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';

const PageHeader = () => {
    const user = authService.getUser();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            const count = await cartService.getCartCount();
            setCartCount(count);
        };
        fetchCartCount();

        const unsubscribe = eventService.subscribe('cartUpdated', (count) => {
            setCartCount(count);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (
        <div className={`${classes.header_container} row`}>
            <div className={`${classes.logo_container} col`}>
                <Link to="/">
                    <img src={logo} alt="logo" className={classes.logo} />
                </Link>
                <Link to="/" className={classes.logo_link}>
                    <h1 className={classes.logo_title}>Minas Morgul Cards</h1>
                </Link>
            </div>
            <div className={`${classes.header_icons} col`}>
                <div className={`${classes.header_icons} col`}>
                    <Link to="/cart">
                        <CartIcon itemCount={cartCount} />
                    </Link>
                    {!user ? (
                        <Link to="/login">
                            <FontAwesomeIcon icon={faUser} className={classes.header_icon} />
                            <span className={classes.header_icon_text}>Sign in</span>
                        </Link>
                    ) : (
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
                <div className="col">
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
