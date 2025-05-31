import { Link } from 'react-router-dom';
import classes from './RegisterForm.module.css';
import Button from '../../ui/common/Button';
import Input from '../../ui/common/Input';

const RegisterForm = ({ formData, onChange, onSubmit, error, fieldErrors }) => {
    return (
        <form onSubmit={onSubmit} className={`${classes.register_form}`}>
            <h1 className="custom_h1 mb-3">Create new account</h1>
            {error && <div className={classes.error_message}>{error}</div>}
            <Input
                label=""
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email"
                className={classes.input_field}
                error={fieldErrors?.email}
            />
            <Input
                label=""
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={onChange}
                placeholder="First Name"
                className={classes.input_field}
                error={fieldErrors?.first_name}
            />
            <Input
                label=""
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={onChange}
                placeholder="Last Name"
                className={classes.input_field}
                error={fieldErrors?.last_name}
            />
            <Input
                label=""
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Password"
                className={classes.input_field}
                error={fieldErrors?.password}
            />
            <Input
                label=""
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={onChange}
                placeholder="Confirm Password"
                className={classes.input_field}
                error={fieldErrors?.password2}
            />
            <Button type="submit">
                Register
            </Button>
            <p className="text_small">Already have an account? <Link to="/login" className={classes.login_button}>Login</Link></p>
        </form>
    );
};

export default RegisterForm; 