import classes from '../components/profile/ProfileForm.module.css';
import { useProfileData } from '../hooks/useProfileData';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfileView from '../components/profile/ProfileView';
import ProfileEditForm from '../components/profile/ProfileEditForm';

const ProfileForm = () => {
    const { profileData, setProfileData, isLoading, error: fetchError, fetchUserData } = useProfileData();
    const {
        error: formError,
        success,
        isEditing,
        handleChange,
        handleSubmit,
        handleEditClick,
        handleCancelClick
    } = useProfileForm(profileData, setProfileData);

    if (isLoading) {
        return <div className={classes.loading}>Loading...</div>;
    }

    return (
        <div className="row justify-content-center mt-3">
            <div className={`${classes.profile_container} col-12 col-md-8 col-lg-8 col-xl-8`}>
                <h1 className="custom_h1 mb-3">My Profile</h1>
                {(fetchError || formError) && (
                    <div className={classes.error_message}>{fetchError || formError}</div>
                )}
                {success && <div className={classes.success_message}>{success}</div>}

                {!isEditing ? (
                    <ProfileView
                        profileData={profileData}
                        onEditClick={handleEditClick}
                    />
                ) : (
                    <ProfileEditForm
                        profileData={profileData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelClick}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfileForm; 