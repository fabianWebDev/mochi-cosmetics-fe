import React, { useEffect, useState } from 'react';
import { TOAST_DURATION } from '../constants';

const ErrorNotification = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setError(event.detail);
      // Auto-hide after TOAST_DURATION
      setTimeout(() => {
        setError(null);
      }, TOAST_DURATION);
    };

    window.addEventListener('apiError', handleError);
    return () => window.removeEventListener('apiError', handleError);
  }, []);

  if (!error) return null;

  return (
    <div className={`error-notification ${error.type}`}>
      <div className="error-content">
        <p className="error-message">{error.message}</p>
        {error.details && (
          <ul className="error-details">
            {Object.entries(error.details).map(([key, value]) => (
              <li key={key}>{`${key}: ${value}`}</li>
            ))}
          </ul>
        )}
      </div>
      <button 
        className="error-close"
        onClick={() => setError(null)}
      >
        ×
      </button>
    </div>
  );
};

export default ErrorNotification; 