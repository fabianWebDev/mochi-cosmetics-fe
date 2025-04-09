import FooterMenu from '../ui/FooterMenu';
import classes from '../../styles/Footer.module.css';
import FooterContactUs from '../ui/FooterContactUs';
import FooterSocial from '../ui/FooterSocial';

const Footer = () => {
    return (
        <footer className={`${classes.footer_container}`}>
            <div className={`row mt-5 ${classes.footer_row}`}>
                <div className={`col-md-4 ${classes.footer_col}`}>
                    <FooterMenu className={classes.footer_menu} />
                </div>
                <div className={`col-md-4 ${classes.footer_col}`}>
                    <FooterContactUs className={classes.footer_menu} />
                </div>
                <div className={`col-md-4 ${classes.footer_col}`}>
                    <FooterSocial className={classes.footer_menu} />
                </div>
            </div>
            <p className="text-center">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;
