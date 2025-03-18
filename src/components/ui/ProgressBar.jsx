import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="progress mb-4">
            <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${percentage}%` }} 
                aria-valuenow={percentage} 
                aria-valuemin="0" 
                aria-valuemax="100"
            >
                {currentStep} / {totalSteps}
            </div>
        </div>
    );
};

export default ProgressBar;