import classes from './Button.module.css';

const Button = ({ children, onClick, className, disabled, variant }) => {
    return (
        <button onClick={onClick} className={`${className} ${variant === 'secondary' ? classes.button_secondary : classes.button}`} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
