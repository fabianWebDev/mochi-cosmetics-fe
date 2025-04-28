import { useNavigate } from 'react-router-dom';
import classes from './HeaderIcons.module.css';

const UserDropdown = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
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
        </div>
    );
};

export default UserDropdown; 