import { authService } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const PageHead = () => {
    const user = authService.getUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (
        <div className="row">
            <div className="col">
                <Link to="/">
                    My Store
                </Link>
            </div>
            <div className="col d-flex justify-content-end">
                <Link to="/cart">
                    <FontAwesomeIcon icon={faCartShopping} style={{ color: '#eb9ec1', width: '24px', height: '24px' }} />
                </Link>
                {!user ? (
                    <Link to="/login">
                        <FontAwesomeIcon icon={faUser} style={{ color: '#eb9ec1', width: '24px', height: '24px' }} />
                    </Link>
                ) : (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHead;
