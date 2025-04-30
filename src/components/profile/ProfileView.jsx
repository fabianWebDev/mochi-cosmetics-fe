import classes from './ProfileForm.module.css';
import { Link } from 'react-router-dom';
const ProfileView = ({ profileData, onEditClick }) => {
    return (
        <div className={classes.profile_view}>
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
                    <Link to="/orders" className={classes.info_value}>Order History</Link>
                </div>
                <div className={classes.info_row}>
                    <button
                        type="button"
                        onClick={onEditClick}
                        className={`${classes.edit_button}`}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView; 