import clsx from 'clsx';
import classes from './Button.module.css';

const Button = ({ children, onClick, className, disabled, variant = 'primary' }) => {
    const variantClass = {
        primary: classes.button_primary,
        secondary: classes.button_secondary,
        danger: classes.button_danger,
        tertiary: classes.button_tertiary,
    }[variant];

    return (
        <button
            onClick={onClick}
            className={clsx(classes.button, variantClass, className)}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;