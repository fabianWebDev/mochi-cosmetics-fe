import FooterMenu from '../footer/FooterMenu';
import classes from './Footer.module.css';
import FooterContactUs from '../footer/FooterContactUs';
import FooterSocial from '../footer/FooterSocial';
import FooterAbout from '../footer/FooterAbout';
import MainFrame from './MainFrame';
import SecondaryFrame from './SecondaryFrame';

const Footer = () => {
    return (

        <footer className={`${classes.footer_container} footer_background`}>
            <MainFrame>
                <SecondaryFrame>
                    <div className={`row ${classes.footer_row} gx-0 gy-4`}>
                        <div className={`col-md-4 ${classes.footer_col}`}>
                            <FooterMenu className={classes.footer_menu} />
                        </div>
                        <div className={`col-md-4 ${classes.footer_col}`}>
                            <FooterContactUs className={classes.footer_menu} />
                        </div>
                        <div className={`col-md-4 ${classes.footer_col}`}>
                            <FooterSocial className={classes.footer_menu} />
                        </div>
                        {/* <div className={`col-md-4 ${classes.footer_col}`}>
                            <FooterAbout className={classes.footer_menu} />
                        </div> */}
                    </div>
                    <hr className={`${classes.footer_hr} mt-3`} />
                    <p className={`${classes.footer_copyright} text-center`}>
                        &copy; {new Date().getFullYear()} All rights reserved -
                        Created by <a href="https://wizardofcode.net" target="_blank" rel="noopener noreferrer">
                            <span className="wizardOfCode">
                                WizardOfCode
                            </span>
                        </a>
                    </p>
                </SecondaryFrame>
            </MainFrame>
        </footer>

    );
};

export default Footer;
