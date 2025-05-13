import React from 'react';
import './CancelOrderModal.css';
import Button from '../ui/common/Button';

const CancelOrderModal = ({ show, onClose, onConfirm }) => {
    return (
        <>
            <div className={`modal ${show ? 'modal-show' : ''}`} 
                 style={{ display: show ? 'block' : 'none' }} 
                 tabIndex="-1" 
                 role="dialog">
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title custom_h2">Confirm Order Cancellation</h5>
                            <button type="button" 
                                    className="modal-close" 
                                    onClick={onClose} 
                                    aria-label="Close">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer d-flex">
                            <div className="col-3 p-0">
                                <Button type="button" 
                                        variant="tertiary"
                                        onClick={onClose}>
                                Close
                            </Button>
                            </div>
                            <div className="col-6 p-0">
                            <Button type="button" 
                                    variant="danger"
                                    onClick={onConfirm}>
                                Confirm Cancel
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div className="modal-backdrop"></div>
            )}
        </>
    );
};

export default CancelOrderModal; 