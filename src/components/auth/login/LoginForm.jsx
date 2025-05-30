import { Link } from 'react-router-dom';
import classes from './LoginForm.module.css';
import Button from '../../ui/common/Button';
import Input from '../../ui/common/Input';

const LoginForm = ({ formData, onChange, onSubmit, loading, error, fieldErrors }) => {

    return (
        <form onSubmit={onSubmit} className={`${classes.login_form}`}>
            <h1 className="custom_h1 mb-3">Sign in</h1>
            {error && <div className={classes.error_message}>{error}</div>}
            <Input
                label=""
                name="email"
                value={formData.email}
                onChange={onChange}
                disabled={loading}
                placeholder="Email"
                className={classes.input_field}
                error={fieldErrors.email}
            />
            <Input
                label=""
                name="password"
                value={formData.password}
                onChange={onChange}
                disabled={loading}
                placeholder="Password"
                className={classes.input_field}
                type="password"
                error={fieldErrors.password}
            />
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
