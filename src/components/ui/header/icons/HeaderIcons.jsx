import { Link } from 'react-router-dom';
import UserIcon from '../user/UserIcon';
import classes from './HeaderIcons.module.css';
import Logout from '../user/Logout';
import CartIconWithCount from '../../../cart/CartIconWithCount';
import useAuth from '../../../../hooks/useAuth';

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
                    <UserIcon className={classes.header_icon} />
                    <Logout />
                </>
            )}
        </div>
    );
};

export default HeaderIcons;
