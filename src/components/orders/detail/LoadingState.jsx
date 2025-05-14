import React from 'react';
import styles from './LoadingState.module.css';

const LoadingState = () => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                <div className={styles.loading_container}>
                    <h6 className={styles.loading_text}>Loading order details...</h6>
                </div>
            </div>
        </div>
    );
};

export default LoadingState; 