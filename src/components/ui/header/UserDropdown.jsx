import { Link } from 'react-router-dom';
import classes from './HeaderIcons.module.css';

const UserDropdown = () => {
    return (
        <div className={classes.dropdown_menu}>
            <Link to="/profile" className={classes.dropdown_item}>
                Account Information
            </Link>
            <Link to="/orders" className={classes.dropdown_item}>
                My Orders
            </Link>
        </div>
    );
};

export default UserDropdown; 