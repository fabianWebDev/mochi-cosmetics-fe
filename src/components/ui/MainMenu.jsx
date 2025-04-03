import classes from '../../styles/MainMenu.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const MainMenu = () => {
    const [categories, setCategories] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`${classes.main_menu} navbar`}>
            <button className={classes.mobile_menu_button} onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>
            <div className={`${classes.nav_items} ${isMobileMenuOpen ? classes.mobile_menu_open : ''}`}>
                <Link to="/products?search=mtg" className={classes.nav_item} onClick={closeMobileMenu}>
                    Magic The Gathering
                </Link>
                <div
                    className={classes.sub_menu_container}
                    onMouseEnter={() => setShowSubMenu(true)}
                    onMouseLeave={() => setShowSubMenu(false)}
                >
                    <Link to="/products" className={classes.nav_item} onClick={closeMobileMenu}>
                        Products
                    </Link>
                    {showSubMenu && (
                        <div className={`${classes.sub_menu}`}>
                            {categories.map(category => (
                                <Link
                                    key={category.id}
                                    to={`/products?search=${category.name}`}
                                    className={`${classes.nav_item} ${classes.sub_menu_item}`}
                                    onClick={closeMobileMenu}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/contact" className={classes.nav_item} onClick={closeMobileMenu}>
                    Contact
                </Link>
                <Link to="/about" className={classes.nav_item} onClick={closeMobileMenu}>
                    About
                </Link>
            </div>
        </nav>
    );
};

export default MainMenu;