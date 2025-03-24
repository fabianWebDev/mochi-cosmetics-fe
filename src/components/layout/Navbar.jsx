import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import SearchBar from './SearchBar';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { MEDIA_BASE_URL } from '../../constants';

function Navbar() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [categories, setCategories] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
        <nav>
            <div>
                <Link to="/">
                    My Store
                </Link>
                <div>
                    <Link to="/">
                        Home
                    </Link>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowSubMenu(true)}
                        onMouseLeave={() => setShowSubMenu(false)}
                    >
                        <Link to="/products">
                            Products
                        </Link>
                        {showSubMenu && (
                            <div>
                                {categories.map(category => (
                                    <Link
                                        key={category.id}
                                        to={`/products?search=${category.name}`}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/contact">
                        Contact
                    </Link>
                    <Link to="/cart">
                        Cart
                    </Link>
                    <Link to="/about">
                        About
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login">
                                Login
                            </Link>
                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/orders">
                                My Orders
                            </Link>
                            {user.is_admin && (
                                <Link to={`${MEDIA_BASE_URL}/admin`}>
                                    Admin Panel
                                </Link>
                            )}
                            <span>
                                {user.first_name || user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
            <SearchBar />
        </nav>
    );
}

export default Navbar;
