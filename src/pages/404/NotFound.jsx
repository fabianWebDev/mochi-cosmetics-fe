import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/common';
import classes from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={classes.notFoundContainer}>
            <div className={classes.content}>
                <div className={classes.errorCode}>404</div>
                <h1 className={classes.title}>Page Not Found</h1>
                <p className={classes.description}>
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <div className={classes.actions}>
                    <Button 
                        onClick={handleGoHome} 
                        variant="primary"
                        className={classes.button}
                    >
                        Home
                    </Button>
                    <Button 
                        onClick={handleGoBack} 
                        variant="secondary"
                        className={classes.button}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;