import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

const FooterSocial = ({ className }) => {
    return (
        <div className={className}>
            <h3>Follow us</h3>
            <div className="social-media justify-content-center d-flex gap-2">
                <Link to="https://www.facebook.com/profile.php?id=61552798884871" target="_blank">
                    <FontAwesomeIcon icon={faFacebook} className={`${classes.footer_social_icon} ${classes.facebook_icon}`} />
                </Link>
                <Link to="https://www.instagram.com/minas_morgul_cards/" target="_blank">
                    <FontAwesomeIcon icon={faInstagram} className={`${classes.footer_social_icon} ${classes.instagram_icon}`} />
                </Link>
              
            </div>
        </div>
    )
}

export default FooterSocial;