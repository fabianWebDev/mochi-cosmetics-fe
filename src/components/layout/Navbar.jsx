import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import SearchBar from '../ui/SearchBar';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { MEDIA_BASE_URL } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

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
        <div className="container">
            <div className="row justify-content-between">
                <div className="col">
                    <Link to="/">
                        My Store
                    </Link>
                </div>
                <div className="col">
                    <Link to="/cart">
                        <FontAwesomeIcon icon={faCartShopping} style={{ color: '#eb9ec1' }} />
                    </Link>
                    {!user ? (
                        <Link to="/login">
                            <FontAwesomeIcon icon={faUser} style={{ color: '#eb9ec1' }} />
                        </Link>
                    ) : (
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
            <div className="row">
                <nav className="navbar">
                    <div className="container-fluid">
                        <Link to="/products?search=mtg">
                            Magic The Gathering
                        </Link>
                        <div
                            className="relative"
                            onMouseEnter={() => setShowSubMenu(true)}
                            onMouseLeave={() => setShowSubMenu(false)}
                        >
                            <Link to="/products">
                                Products
                            </Link>
                        </div>
                        <Link to="/contact">
                            Contact
                        </Link>

                        <Link to="/about">
                            About
                        </Link>
                        {!user ? (
                            <>

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

                            </>
                        )}
                    </div>
                </nav>
            </div>
            <div className="row">
                <div className="container-fluid">
                    {showSubMenu && (
                        <>
                            {categories.map(category => (
                                <Link
                                    key={category.id}
                                    to={`/products?search=${category.name}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="">
                    <SearchBar />
                </div>
            </div>
        </div >
    );
}

export default Navbar;
