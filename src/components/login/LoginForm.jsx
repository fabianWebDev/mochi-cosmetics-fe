import { useNavigate, Link } from 'react-router-dom';
import classes from '../../styles/LoginForm.module.css';

const LoginForm = ({ formData, onChange, onSubmit, loading, error }) => {
    const navigate = useNavigate();

    return (
        <form onSubmit={onSubmit} className={`${classes.login_form} col-md-8`}>
            <h1 className={classes.login_form_title}>Sign in</h1>
            {error && <div className="error-message">{error}</div>}
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
            <button type="submit" className={classes.login_button} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className={classes.register_button_container}>Don't have an account yet? <Link to="/register" className={classes.register_button}>Register</Link></p>
        </form>
    );
};

export default LoginForm;
