import { Link } from 'react-router-dom';
import UserIcon from '../user/UserIcon';
import classes from './HeaderIcons.module.css';
import Logout from '../user/Logout';
import useAuth from '../../../../hooks/useAuth';
import { CartIcon } from '../../cart';

const HeaderIcons = () => {
    const { isAuthenticated, getUser } = useAuth();
    const user = getUser();

    return (
        <div className={classes.header_icons}>
            <CartIcon 
                className={classes.header_icon} 
                useDynamicCount={true}
                linkToCart={true}
            />
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
