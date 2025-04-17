import { Link } from 'react-router-dom';
import UserIcon from './UserIcon';
import classes from './HeaderIcons.module.css';
import Logout from './Logout';
import CartIconWithCount from '../cart/CartIconWithCount';
import useAuth from '../../../hooks/useAuth';

const HeaderIcons = () => {
    const { isAuthenticated, getUser } = useAuth();
    const user = getUser();

    return (
        <div className={classes.header_icons}>
            <CartIconWithCount className={classes.header_icon} />
            {!isAuthenticated ? (
                <Link to="/login">
                    <button className={classes.logout_button}>
                        Sign in
                    </button>
                </Link>
            ) : (
                <>
                    <Link to="/profile">
                        <UserIcon className={classes.header_icon} />
                    </Link>
                    <Logout />
                </>
            )}
        </div>
    );
};

export default HeaderIcons;
