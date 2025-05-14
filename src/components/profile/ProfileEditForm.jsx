import classes from './ProfileForm.module.css';
import Button from '../ui/common/Button';
import Input from '../ui/common/Input';
const ProfileEditForm = ({ profileData, onChange, onSubmit, onCancel }) => {
    return (
        <div className={classes.profile_view}>
            <h1 className="custom_h1 mb-3">Edit Profile</h1>
            <form onSubmit={onSubmit}>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Email"
                />
                <Input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="First Name"
                />
                <Input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Last Name"
                />
                <Input
                    type="password"
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="New Password (leave blank to keep current)"
                />
                <Input
                    type="password"
                    id="password2"
                    name="password2"
                    value={profileData.password2}
                    onChange={onChange}
                    className={classes.input_field}
                    placeholder="Confirm New Password"
                />
                <div className={classes.button_group}>
                    <Button type="submit" variant="secondary">
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm; 