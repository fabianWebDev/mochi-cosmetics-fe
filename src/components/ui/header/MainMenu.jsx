import classes from './MainMenu.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../../../services/productService';
import Logout from './Logout';
import CartIconWithCount from '../cart/CartIconWithCount';
import useAuth from '../../../hooks/useAuth';
import UserIcon from './UserIcon';
import { FaChevronDown } from 'react-icons/fa';

const MainMenu = () => {
    const [categories, setCategories] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

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
                    <Link to="/" className={classes.nav_item} onClick={handleLinkClick}>
                        Home
                    </Link>
                    <Link to="/products?search=mtg" className={classes.nav_item} onClick={handleLinkClick}>
                        Magic The Gathering
                    </Link>
                    <div
                        className={classes.sub_menu_container}
                        onMouseEnter={() => setShowSubMenu(true)}
                        onMouseLeave={() => setShowSubMenu(false)}
                    >
                        <Link
                            to="/products"
                            className={`${classes.nav_item} ${showSubMenu ? classes.sub_menu_x : ''}`}
                            onClick={handleLinkClick}
                        >
                            Products
                            <FaChevronDown className={`${classes.arrow_icon} ${showSubMenu ? classes.arrow_icon_rotated : ''}`} />
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
                    {isMobileMenuOpen && (
                        isAuthenticated ? (
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
                <UserIcon className={classes.user_icon} />
            </div>
        </div>
    );
};

export default MainMenu;