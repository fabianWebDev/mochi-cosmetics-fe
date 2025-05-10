import PropTypes from 'prop-types';
import classes from './Input.module.css';

const Input = ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    placeholder,
    required = false,
    disabled = false,
    min,
    max,
    step,
    className,
    ...props
}) => (
    <div className={`${classes.form_group} ${className || ''}`}>
        {label && (
            <label htmlFor={name} className={classes.label}>
                {label}
                {required && <span className={classes.required}>*</span>}
            </label>
        )}
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${classes.input_field} ${error ? classes.error : ''}`}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
        />
        {error && (
            <div className={classes.error_message} id={`${name}-error`}>
                {error}
            </div>
        )}
    </div>
);

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    type: PropTypes.oneOf([
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'month',
        'week'
    ]),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string
};

export default Input;