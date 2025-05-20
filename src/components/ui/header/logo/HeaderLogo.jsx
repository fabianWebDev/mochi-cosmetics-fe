import { Link } from 'react-router-dom';
import classes from './HeaderLogo.module.css';
import logo from '../../../../assets/logo.png';

const HeaderLogo = () => {
    return (
        <>
            <Link to="/">
                <img src={logo} alt="logo" className={classes.logo} />
            </Link>
            <Link to="/" className={classes.logo_link}>
                <h1 className={classes.logo_title}>Minas Morgul Cards</h1>
            </Link>
        </>
    );
};

export default HeaderLogo;
