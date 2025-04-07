import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    
    return (
        <div className="error-message">
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage; 