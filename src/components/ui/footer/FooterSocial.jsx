import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const FooterSocial = ({ className }) => {
    return (
        <div className={className}>
            <h3>Follow us</h3>
            <div className="social-media justify-content-center">
                <a href="/">
                    <FontAwesomeIcon icon={faFacebook} style={{ width: '40px', height: '40px', color: 'var(--primary-color)' }} />
                </a>
                <a href="/">
                    <FontAwesomeIcon icon={faInstagram} style={{ width: '40px', height: '40px', color: 'var(--primary-color)' }} />
                </a>
            </div>
        </div>
    )
}

export default FooterSocial;