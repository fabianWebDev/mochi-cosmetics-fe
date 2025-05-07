import React from 'react';
import classes from './ShippingInfo.module.css';
import Button from '../ui/common/Button';

const ShippingInfo = ({ shippingInfo, onInputChange, onSubmit }) => {
    return (
        <div className={classes.shipping_info}>
            <h1 className="custom_h1 mb-3">Shipping Information</h1>
            <form onSubmit={onSubmit}>
                <div className={classes.form_group}>
                    <input
                        type="text"
                        className={classes.form_control}
                        id="full_name"
                        name="full_name"
                        value={shippingInfo.full_name}
                        onChange={onInputChange}
                        required={true}
                        placeholder="Full Name"
                    />
                </div>
                {!shippingInfo.pickup && (
                    <>
                        <div className={classes.form_group}>
                            <input
                                type="text"
                                className={classes.form_control}
                                id="province"
                                name="province"
                                value={shippingInfo.province}
                                onChange={onInputChange}
                                required
                                placeholder="Province"
                            />
                        </div>
                        <div className={classes.form_group}>
                            <input
                                type="text"
                                className={classes.form_control}
                                id="canton"
                                name="canton"
                                value={shippingInfo.canton}
                                onChange={onInputChange}
                                required
                                placeholder="Canton"
                            />
                        </div>
                        <div className={classes.form_group}>
                            <input
                                type="text"
                                className={classes.form_control}
                                id="district"
                                name="district"
                                value={shippingInfo.district}
                                onChange={onInputChange}
                                required
                                placeholder="District"
                            />
                        </div>
                        <div className={classes.form_group}>
                            <input
                                type="text"
                                className={classes.form_control}
                                id="exact_address"
                                name="exact_address"
                                value={shippingInfo.exact_address}
                                onChange={onInputChange}
                                required
                                placeholder="Exact Address"
                            />
                        </div>
                        <div className={classes.form_group}>
                            <input
                                type="text"
                                className={classes.form_control}
                                id="shipping_phone"
                                name="shipping_phone"
                                value={shippingInfo.shipping_phone}
                                onChange={onInputChange}
                                required
                                placeholder="Phone Number"
                            />
                        </div>
                    </>
                )}
                <div className={classes.checkbox_container}>
                    <input
                        type="checkbox"
                        id="pickup"
                        name="pickup"
                        className={classes.checkbox}
                        checked={shippingInfo.pickup}
                        onChange={onInputChange}
                    />
                    <label htmlFor="pickup" className={classes.checkbox_label}>Pick up in store</label>
                </div>
                <div className={`${classes.button_container} mt-2`}>
                    <Button type="submit">Order Summary</Button>
                </div>
            </form>
        </div>
    );
};

export default ShippingInfo; 