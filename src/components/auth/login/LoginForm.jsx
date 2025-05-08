import { useNavigate, Link } from 'react-router-dom';
import classes from './LoginForm.module.css';
import Button from '../../ui/common/Button';

const LoginForm = ({ formData, onChange, onSubmit, loading, error }) => {
    const navigate = useNavigate();

    return (
        <form onSubmit={onSubmit} className={`${classes.login_form}`}>
            <h1 className="custom_h1 mb-3">Sign in</h1>
            {error && <div className={classes.error_message}>{error}</div>}
            <div className={classes.form_group}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    disabled={loading}
                    placeholder="Email"
                    className={classes.input_field}
                />
            </div>
            <div className={classes.form_group}>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    required
                    disabled={loading}
                    placeholder="Password"
                    className={classes.input_field}
                />
            </div>
            <Button type="submit" disabled={loading} className={classes.login_button}>
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className={`${classes.forgot_password_container}`} >
                <Link to="/password-reset" className={classes.forgot_password_link}>
                    Forgot your password?
                </Link>
            </div>
            <p className={`${classes.register_button_container}`}>Don't have an account yet? <Link to="/register" className={classes.register_button}>Register</Link></p>
        </form>
    );
};

export default LoginForm;
