import React from 'react';

const CancelOrderModal = ({ show, onClose, onConfirm }) => {
    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`} 
                 style={{ display: show ? 'block' : 'none' }} 
                 tabIndex="-1" 
                 role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Order Cancellation</h5>
                            <button type="button" 
                                    className="btn-close" 
                                    onClick={onClose} 
                                    aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" 
                                    className="btn btn-secondary" 
                                    onClick={onClose}>
                                Close
                            </button>
                            <button type="button" 
                                    className="btn btn-danger" 
                                    onClick={onConfirm}>
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div className="modal-backdrop fade show"></div>
            )}
        </>
    );
};

export default CancelOrderModal; 