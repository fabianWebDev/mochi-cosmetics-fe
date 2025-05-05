import classes from './Button.module.css';

const Button = ({ children, onClick, className, disabled }) => {
    return (
        <button onClick={onClick} className={`${classes.button} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
