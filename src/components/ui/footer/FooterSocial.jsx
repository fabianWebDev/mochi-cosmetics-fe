import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const FooterSocial = ({ className }) => {
    return (
        <div className={className}>
            <h3>Follow us</h3>
            <div className="social-media justify-content-center">
                <Link to="https://www.facebook.com/profile.php?id=61552798884871" target="_blank">
                    <FontAwesomeIcon icon={faFacebook} style={{ width: '40px', height: '40px', color: '#ffffff' }} />
                </Link>
                <Link to="https://www.instagram.com/minas_morgul_cards/" target="_blank">
                    <FontAwesomeIcon icon={faInstagram} style={{ width: '40px', height: '40px', color: '#ffffff' }} />
                </Link>
            </div>
        </div>
    )
}

export default FooterSocial;