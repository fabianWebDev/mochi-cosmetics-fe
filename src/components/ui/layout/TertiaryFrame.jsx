import classes from './TertiaryFrame.module.css';

const TertiaryFrame = ({ children }) => {
    return (
        <div className={classes.tertiary_frame}>
            {children}
        </div>
    );
};

export default TertiaryFrame;