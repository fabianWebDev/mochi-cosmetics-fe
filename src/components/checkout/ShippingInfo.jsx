import React from 'react';

const ShippingInfo = ({ shippingInfo, onInputChange, onSubmit }) => {
    return (
        <div>
            <h3>Shipping Information</h3>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        name="full_name"
                        value={shippingInfo.full_name}
                        onChange={onInputChange}
                        required={!shippingInfo.pickup}
                    />
                </div>
                {!shippingInfo.pickup && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="province" className="form-label">Provincia</label>
                            <input
                                type="text"
                                className="form-control"
                                id="province"
                                name="province"
                                value={shippingInfo.province}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="canton" className="form-label">Cantón</label>
                            <input
                                type="text"
                                className="form-control"
                                id="canton"
                                name="canton"
                                value={shippingInfo.canton}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="district" className="form-label">Distrito</label>
                            <input
                                type="text"
                                className="form-control"
                                id="district"
                                name="district"
                                value={shippingInfo.district}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exact_address" className="form-label">Dirección Exacta</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exact_address"
                                name="exact_address"
                                value={shippingInfo.exact_address}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="shipping_phone" className="form-label">Número de Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                id="shipping_phone"
                                name="shipping_phone"
                                value={shippingInfo.shipping_phone}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                    </>
                )}
                <div className="mb-3">
                    <label htmlFor="pickup" className="form-label">
                        <input
                            type="checkbox"
                            id="pickup"
                            name="pickup"
                            checked={shippingInfo.pickup}
                            onChange={onInputChange}
                        />
                        Pick up in store
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Next</button>
            </form>
        </div>
    );
};

export default ShippingInfo; 