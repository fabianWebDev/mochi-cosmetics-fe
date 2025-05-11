import classes from './Logout.module.css';
import { authService } from '../../../../services/authService';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (
        <button onClick={handleLogout} className={classes.logout_button}>
            Logout
        </button>
    );
};
export default Logout;
