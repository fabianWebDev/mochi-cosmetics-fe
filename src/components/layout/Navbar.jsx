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
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl">
                    My Store
                </Link>
                <div className="flex space-x-4 items-center">
                    <Link to="/" className="hover:text-gray-300">
                        Home
                    </Link>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowSubMenu(true)}
                        onMouseLeave={() => setShowSubMenu(false)}
                    >
                        <Link to="/products" className="hover:text-gray-300">
                            Products
                        </Link>
                        {showSubMenu && (
                            <div className="absolute bg-white shadow-lg mt-2 rounded">
                                {categories.map(category => (
                                    <Link
                                        key={category.id}
                                        to={`/products?search=${category.name}`}
                                        className="block px-4 py-2 hover:bg-gray-200"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/contact" className="hover:text-gray-300">
                        Contact
                    </Link>
                    <Link to="/cart" className="hover:text-gray-300 flex items-center">
                        <i className="bi bi-cart me-1"></i>
                        Cart
                    </Link>
                    <Link to="/about" className="hover:text-gray-300">
                        About
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-gray-300">
                                Login
                            </Link>
                            <Link to="/register" className="hover:text-gray-300">
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/orders" className="hover:text-gray-300">
                                My Orders
                            </Link>
                            <span className="text-gray-300">
                                {user.first_name || user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-300 cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    )}
                    {user.is_admin && (
                        <Link to={`${MEDIA_BASE_URL}/admin`} className="hover:text-gray-300">
                            Admin
                        </Link>
                    )}
                </div>
            </div>
            <SearchBar />
        </nav>
    );
}

export default Navbar;
