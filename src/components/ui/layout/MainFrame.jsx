import classes from './MainFrame.module.css';

const MainFrame = ({ children }) => {
    return (
        <div className={`${classes.main_frame} container justify-content-center`}>
            {children}
        </div>
    );
};

export default MainFrame;