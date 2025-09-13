import classes from './SecondaryFrame.module.css';

const SecondaryFrame = ({ children }) => {
    return (
        <div className={`${classes.secondary_frame} justify-content-center`}>
            {children}
        </div>
    );
};

export default SecondaryFrame;