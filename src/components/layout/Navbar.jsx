import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import SearchBar from '../ui/SearchBar';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { MEDIA_BASE_URL } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import MainMenu from '../ui/MainMenu';

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
        <div className="container">
            <div className="row">
                <div className="col">
                    <Link to="/">
                        My Store
                    </Link>
                </div>
                <div className="col d-flex justify-content-end">
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
            <MainMenu />
            <SearchBar />
        </div >
    );
}

export default Navbar;
