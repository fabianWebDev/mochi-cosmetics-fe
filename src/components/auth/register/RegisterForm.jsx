import { Link } from 'react-router-dom';
import classes from './RegisterForm.module.css';
import Button from '../../ui/common/Button';

const RegisterForm = ({ formData, onChange, onSubmit, error }) => {
    return (
        <form onSubmit={onSubmit} className={`${classes.register_form} col-md-8`}>
            <h1 className="custom_h1 mb-3">Create new account</h1>
            {error && <div className={classes.error_message}>{error}</div>}

            <div className={classes.form_group}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    placeholder="Email"
                    className={classes.input_field}
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={onChange}
                    required
                    placeholder="First Name"
                    className={classes.input_field}
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={onChange}
                    required
                    placeholder="Last Name"
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
                    placeholder="Password"
                    className={classes.input_field}
                />
            </div>

            <div className={classes.form_group}>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={onChange}
                    required
                    placeholder="Confirm Password"
                    className={classes.input_field}
                />
            </div>

            <Button type="submit">
                Register
            </Button>
            <p className={classes.register_button_container}>Already have an account? <Link to="/login" className={classes.login_button}>Login</Link></p>
        </form>
    );
};

export default RegisterForm; 