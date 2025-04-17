import FooterMenu from '../ui/footer/FooterMenu';
import classes from './Footer.module.css';
import FooterContactUs from '../ui/footer/FooterContactUs';
import FooterSocial from '../ui/footer/FooterSocial';

const Footer = () => {
    return (
        <footer className={`${classes.footer_container}`}>
            <div className={`row mt-5 ${classes.footer_row}`}>
                <hr className={`${classes.footer_hr} mb-2`} />
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
            <hr className={`${classes.footer_hr} mt-2`} />
            <p className={`${classes.footer_copyright} text-center mt-2 mb-2`}>
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;
