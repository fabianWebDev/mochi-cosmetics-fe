import React from 'react';
import styles from './Error.module.css';

const Error = ({ 
    message = "Ha ocurrido un error", 
    variant = "default", // default, warning, danger, success
    size = "medium", // small, medium, large
    showIcon = true,
    className = ""
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'warning':
                return '⚠️';
            case 'danger':
                return '❌';
            case 'success':
                return '✅';
            default:
                return '⚠️';
        }
    };

    return (
        <div className={`${styles.error} ${styles[variant]} ${styles[size]} ${className}`}>
            {showIcon && (
                <span className={styles.icon}>
                    {getIcon()}
                </span>
            )}
            <span className={styles.message}>
                {message}
            </span>
        </div>
    );
};

export default Error;