import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import SearchBar from './SearchBar';
function Navbar() {
    const navigate = useNavigate();
    const user = authService.getUser();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
                    <Link to="/products" className="hover:text-gray-300">
                        Products
                    </Link>
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
                </div>
            </div>
            <SearchBar />
        </nav>
    );
}

export default Navbar;
