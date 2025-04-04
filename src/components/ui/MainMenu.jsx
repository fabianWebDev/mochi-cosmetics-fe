import classes from '../../styles/MainMenu.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';

const MainMenu = () => {
    const [categories, setCategories] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);

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

    return (
        <nav className={`${classes.main_menu} navbar`}>
            <div className={`${classes.nav_items} col col-sm-12 col-md-8`}>
                <Link to="/products?search=mtg" className={classes.nav_item}>
                    Magic The Gathering
                </Link>
                <div
                    className={classes.sub_menu_container}
                    onMouseEnter={() => setShowSubMenu(true)}
                    onMouseLeave={() => setShowSubMenu(false)}
                >
                    <Link to="/products" className={classes.nav_item}>
                        Products
                    </Link>
                    {showSubMenu && (
                        <div className={`${classes.sub_menu}`}>
                            {categories.map(category => (
                                <Link
                                    key={category.id}
                                    to={`/products?search=${category.name}`}
                                    className={`${classes.nav_item} ${classes.sub_menu_item}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/contact" className={classes.nav_item}>
                    Contact
                </Link>
                <Link to="/about" className={classes.nav_item}>
                    About
                </Link>
            </div>
        </nav>
    );
};

export default MainMenu;