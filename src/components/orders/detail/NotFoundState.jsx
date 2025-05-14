import React from 'react';
import styles from './NotFoundState.module.css';

const NotFoundState = () => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                <div className={styles.not_found_container}>
                    <h6>Order not found.</h6>
                </div>
            </div>
        </div>
    );
};

export default NotFoundState; 