import { Link } from 'react-router-dom';
import classes from './HeaderLogo.module.css';
import { storeConfig } from '../../../../config/storeConfig';

const HeaderLogo = () => {
    return (
        <>
            <Link to="/">
                <img src={storeConfig.logo} alt="logo" className={classes.logo} />
            </Link>
            <Link to="/" className={classes.logo_link}>
                <h1 className={classes.logo_title}>{storeConfig.name}</h1>
            </Link>
        </>
    );
};

export default HeaderLogo;
