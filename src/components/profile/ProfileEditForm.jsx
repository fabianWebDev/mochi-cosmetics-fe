import classes from './ProfileForm.module.css';
import Button from '../ui/common/Button';
const ProfileEditForm = ({ profileData, onChange, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit} className={`${classes.profile_form}`}>
            <div className={classes.form_group}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Email"
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="First Name"
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Last Name"
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="New Password (leave blank to keep current)"
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={profileData.password2}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Confirm New Password"
                />
            </div>

            <div className={classes.button_group}>
                <Button type="submit" variant="secondary">
                    Save Changes
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    className={classes.cancel_button}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default ProfileEditForm; 