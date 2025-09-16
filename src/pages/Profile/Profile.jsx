import classes from '../../components/profile/ProfileForm.module.css';
import { useProfileData } from '../../hooks/useProfileData';
import { useProfileForm } from '../../hooks/useProfileForm';
import ProfileView from '../../components/profile/ProfileView';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import Loading from '../../components/ui/common/Loading';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';
import TertiaryFrame from '../../components/ui/layout/TertiaryFrame';

const Profile = () => {
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
        return <Loading />;
    }

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className={`col-12 col-md-8 col-lg-8 col-xl-8 margin_auto`}>
                    <TertiaryFrame>
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
                    </TertiaryFrame>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default Profile; 