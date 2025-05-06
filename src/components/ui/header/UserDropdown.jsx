import { useNavigate } from 'react-router-dom';
import classes from './HeaderIcons.module.css';
import { authService } from '../../../services/authService';

const UserDropdown = () => {
    const navigate = useNavigate();
    const isAdmin = authService.isAdmin();

    const handleNavigation = (path) => {
        if (path.startsWith('http')) {
            window.open(path, '_blank');
        } else {
            navigate(path);
        }
    };

    return (
        <div className={classes.dropdown_menu}>
            <div
                className={classes.dropdown_item}
                onClick={() => handleNavigation('/profile')}
            >
                Account Information
            </div>
            <div
                className={classes.dropdown_item}
                onClick={() => handleNavigation('/orders')}
            >
                My Orders
            </div>
            {isAdmin && (
                <div
                    className={classes.dropdown_item}
                    onClick={() => handleNavigation('http://localhost:8000/admin')}
                >
                    Admin Dashboard
                </div>
            )}
        </div>
    );
};

export default UserDropdown; 