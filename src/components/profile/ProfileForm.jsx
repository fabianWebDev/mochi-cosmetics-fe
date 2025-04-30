import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './ProfileForm.module.css';
import { authService } from '../../services/authService';
import { API_BASE_URL } from '../../constants';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }

            const token = authService.getToken();
            if (!token) {
                authService.logout();
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: '',
                password2: ''
            }));
        } catch (err) {
            setError('Error loading profile data');
            console.error('Profile fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Only validate passwords if they are being changed
        if (formData.password || formData.password2) {
            if (formData.password !== formData.password2) {
                setError('Passwords do not match');
                return;
            }
        }

        try {
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }

            const token = authService.getToken();
            if (!token) {
                authService.logout();
                navigate('/login');
                return;
            }

            // Create update data object with only the fields that have values
            const updateData = {};
            if (formData.email) updateData.email = formData.email;
            if (formData.first_name) updateData.first_name = formData.first_name;
            if (formData.last_name) updateData.last_name = formData.last_name;
            if (formData.password) updateData.password = formData.password;
            if (formData.password2) updateData.password2 = formData.password2;

            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                // Handle specific field errors
                if (errorData.email) {
                    throw new Error(`Email: ${errorData.email[0]}`);
                } else if (errorData.first_name) {
                    throw new Error(`First Name: ${errorData.first_name[0]}`);
                } else if (errorData.last_name) {
                    throw new Error(`Last Name: ${errorData.last_name[0]}`);
                } else if (errorData.password) {
                    throw new Error(`Password: ${errorData.password[0]}`);
                } else {
                    throw new Error('Error updating profile');
                }
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: '',
                password2: ''
            }));
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
            console.error('Profile update error:', err);
        }
    };

    const handleEditClick = () => {
        setError(null);
        setSuccess(null);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setError(null);
        setSuccess(null);
        setIsEditing(false);
        fetchUserData();
    };

    if (isLoading) {
        return <div className={classes.loading}>Loading...</div>;
    }

    return (
        <div className={classes.profile_container}>
            <h1 className={classes.profile_title}>My Profile</h1>
            {error && <div className={classes.error_message}>{error}</div>}
            {success && <div className={classes.success_message}>{success}</div>}

            {!isEditing ? (
                <div className={classes.profile_view}>
                    <div className={classes.profile_info}>
                        <div className={classes.info_row}>
                            <span className={classes.info_label}>Email:</span>
                            <span className={classes.info_value}>{formData.email}</span>
                        </div>
                        <div className={classes.info_row}>
                            <span className={classes.info_label}>First Name:</span>
                            <span className={classes.info_value}>{formData.first_name}</span>
                        </div>
                        <div className={classes.info_row}>
                            <span className={classes.info_label}>Last Name:</span>
                            <span className={classes.info_value}>{formData.last_name}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleEditClick}
                        className={classes.edit_button}
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={classes.profile_form}>
                    <div className={classes.form_group}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={classes.input_field}
                        />
                    </div>

                    <div className={classes.form_group}>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={classes.input_field}
                        />
                    </div>

                    <div className={classes.form_group}>
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={classes.input_field}
                        />
                    </div>

                    <div className={classes.form_group}>
                        <label htmlFor="password">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={classes.input_field}
                        />
                    </div>

                    <div className={classes.form_group}>
                        <label htmlFor="password2">Confirm New Password</label>
                        <input
                            type="password"
                            id="password2"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            className={classes.input_field}
                        />
                    </div>

                    <div className={classes.button_group}>
                        <button type="submit" className={classes.save_button}>
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelClick}
                            className={classes.cancel_button}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfileForm; 