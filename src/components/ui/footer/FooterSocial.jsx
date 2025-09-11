import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';
export const facebookUrl = import.meta.env.VITE_FACEBOOK_URL;
export const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;

const FooterSocial = ({ className }) => {
    return (
        <div className={className}>
            <h3>Follow us</h3>
            <div className="social-media justify-content-center d-flex gap-2">
                <Link to={facebookUrl} target="_blank">
                    <FontAwesomeIcon icon={faFacebook} className={`${classes.footer_social_icon} ${classes.facebook_icon}`} />
                </Link>
                <Link to={instagramUrl} target="_blank">
                    <FontAwesomeIcon icon={faInstagram} className={`${classes.footer_social_icon} ${classes.instagram_icon}`} />
                </Link>
              
            </div>
        </div>
    )
}

export default FooterSocial;