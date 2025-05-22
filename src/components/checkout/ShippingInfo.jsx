import React, { useState, useEffect } from 'react';
import classes from './ShippingInfo.module.css';
import Button from '../ui/common/Button';
import Input from '../ui/common/Input';
import { orderService } from '../../services/orderService';

const ShippingInfo = ({ shippingInfo, onInputChange, onSubmit }) => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const methods = await orderService.getShippingMethods();
                setShippingMethods(methods);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shipping methods:', error);
                setLoading(false);
            }
        };

        fetchShippingMethods();
    }, []);

    const isCorreosMethod = (methodId) => {
        const method = shippingMethods.find(m => m.id.toString() === methodId);
        return method?.name === 'Correos de Costa Rica';
    };

    const isStorePickup = (methodId) => {
        const method = shippingMethods.find(m => m.id.toString() === methodId);
        return method?.name === 'Store Pickup';
    };

    const isButtonDisabled = !shippingInfo.shipping_method;

    return (
        <div className={classes.shipping_info}>
            <h1 className="custom_h1 mb-3">Shipping Information</h1>
            <form onSubmit={onSubmit}>
                <div className={classes.shipping_methods_container}>
                    <h3 className={classes.shipping_methods_title}>Select Shipping Method</h3>

                    {loading ? (
                        <div className={classes.loading}>Loading shipping methods...</div>
                    ) : (
                        shippingMethods.map((method) => (
                            <div key={method.id} className={classes.shipping_method_option}>
                                <input
                                    type="radio"
                                    id={`method_${method.id}`}
                                    name="shipping_method"
                                    className={classes.radio}
                                    value={method.id}
                                    checked={shippingInfo.shipping_method === method.id.toString()}
                                    onChange={onInputChange}
                                />
                                <label htmlFor={`method_${method.id}`} className={classes.radio_label}>
                                    {method.name} - ${method.price}
                                </label>
                            </div>
                        ))
                    )}
                </div>

                <div className={`${classes.form_group} ${!shippingInfo.shipping_method ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="full_name"
                        name="full_name"
                        value={shippingInfo.full_name}
                        onChange={onInputChange}
                        required={!!shippingInfo.shipping_method}
                        placeholder="Full Name"
                    />
                </div>

                <div className={`${classes.form_group} ${!shippingInfo.shipping_method ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="shipping_phone"
                        name="shipping_phone"
                        value={shippingInfo.shipping_phone}
                        onChange={onInputChange}
                        required={shippingInfo.shipping_method === '1' || shippingInfo.shipping_method === '2'}
                        placeholder="Phone Number"
                    />
                </div>

                {/* Address fields for Correos */}
                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="province"
                        name="province"
                        value={shippingInfo.province}
                        onChange={onInputChange}
                        required={isCorreosMethod(shippingInfo.shipping_method)}
                        placeholder="Province"
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="canton"
                        name="canton"
                        value={shippingInfo.canton}
                        onChange={onInputChange}
                        required={isCorreosMethod(shippingInfo.shipping_method)}
                        placeholder="Canton"
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="district"
                        name="district"
                        value={shippingInfo.district}
                        onChange={onInputChange}
                        required={isCorreosMethod(shippingInfo.shipping_method)}
                        placeholder="District"
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={classes.form_control}
                        id="exact_address"
                        name="exact_address"
                        value={shippingInfo.exact_address}
                        onChange={onInputChange}
                        required={isCorreosMethod(shippingInfo.shipping_method)}
                        placeholder="Exact Address"
                    />
                </div>

                <div className={`${classes.button_container} mt-2`}>
                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                    >
                        Order Summary
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ShippingInfo; 