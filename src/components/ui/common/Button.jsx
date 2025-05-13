import classes from './Button.module.css';

const Button = ({ children, onClick, className, disabled, variant }) => {
    return (
        <button onClick={onClick} className={`${className} ${variant === 'secondary' ? classes.button_secondary : variant === 'danger' ? classes.button_danger : classes.button}`} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
