import classes from '../../styles/MainMenu.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import Logout from './Logout';
import { authService } from '../../services/authService';
import CartIconWithCount from './CartIconWithCount';

const MainMenu = () => {
    const [categories, setCategories] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await productService.getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setShowSubMenu(false);
    };

    return (
        <div className={classes.main_menu_container}>
            <nav className={`${classes.main_menu} navbar`}>
                <button
                    className={classes.hamburger_button}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span className={classes.hamburger_line}></span>
                    <span className={classes.hamburger_line}></span>
                    <span className={classes.hamburger_line}></span>
                </button>
                <div className={`${classes.nav_items} ${isMobileMenuOpen ? classes.nav_items_open : ''}`}>
                    <Link to="/products?search=mtg" className={classes.nav_item} onClick={handleLinkClick}>
                        Magic The Gathering
                    </Link>
                    <div
                        className={classes.sub_menu_container}
                        onMouseEnter={() => setShowSubMenu(true)}
                        onMouseLeave={() => setShowSubMenu(false)}
                    >
                        <Link to="/products" className={classes.nav_item} onClick={handleLinkClick}>
                            Products
                        </Link>
                        {showSubMenu && (
                            <div className={`${classes.sub_menu}`}>
                                {categories.map(category => (
                                    <Link
                                        key={category.id}
                                        to={`/products?search=${category.name}`}
                                        className={`${classes.nav_item} ${classes.sub_menu_item}`}
                                        onClick={handleLinkClick}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/contact" className={classes.nav_item} onClick={handleLinkClick}>
                        Contact
                    </Link>
                    <Link to="/about" className={classes.nav_item} onClick={handleLinkClick}>
                        About
                    </Link>
                    {isMobileMenuOpen && (
                        authService.isAuthenticated() ? (
                            <Logout />
                        ) : (
                            <Link to="/login" className={classes.nav_item} onClick={handleLinkClick}>
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            </nav>
            <div className={classes.cart_icon_container}>
                <CartIconWithCount />
            </div>
        </div>
    );
};

export default MainMenu;