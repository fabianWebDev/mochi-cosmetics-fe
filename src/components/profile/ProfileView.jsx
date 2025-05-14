import classes from './ProfileForm.module.css';
import { Link } from 'react-router-dom';
import Button from '../ui/common/Button';

const ProfileView = ({ profileData, onEditClick }) => {
    return (
        <div className={classes.profile_view}>
            <h1 className="custom_h1 mb-3">My Profile</h1>
            <div className={classes.profile_info}>
                <div className={classes.info_row}>
                    <span className={classes.info_label}>Email:</span>
                    <span className={classes.info_value}>{profileData.email}</span>
                </div>
                <div className={classes.info_row}>
                    <span className={classes.info_label}>First Name:</span>
                    <span className={classes.info_value}>{profileData.first_name}</span>
                </div>
                <div className={classes.info_row}>
                    <span className={classes.info_label}>Last Name:</span>
                    <span className={classes.info_value}>{profileData.last_name}</span>
                </div>
                <div className={classes.info_row}>
                    <Link to="/orders" className="text_decoration_none">Order History</Link>
                </div>
                <div className="row">
                    <div className="col-6 col-md-6 col-lg-4 col-xl-2 smooth-col">
                        <Button
                            onClick={onEditClick}
                            variant="tertiary"
                        >
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView; 