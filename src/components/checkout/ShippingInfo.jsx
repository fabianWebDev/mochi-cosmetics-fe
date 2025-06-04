import React, { useState, useEffect } from 'react';
import classes from './ShippingInfo.module.css';
import Button from '../ui/common/Button';
import Input from '../ui/common/Input';
import { orderService } from '../../services/orderService';
import { shippingValidationSchema } from './utils/shippingValidationSchema';
import { toast } from 'react-toastify';

const ShippingInfo = ({ shippingInfo, onInputChange, onSubmit }) => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await shippingValidationSchema.validate(shippingInfo, { abortEarly: false });
            onSubmit(e);
        } catch (validationErrors) {
            const newErrors = {};
            validationErrors.inner.forEach((error) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);

            // Show the first error in a toast
            if (validationErrors.inner.length > 0) {
                toast.error(validationErrors.inner[0].message);
            }
        }
    };

    const handleInputChangeWithValidation = async (e) => {
        const { name, value } = e.target;
        onInputChange(e);

        try {
            await shippingValidationSchema.validateAt(name, { [name]: value });
            setErrors(prev => ({ ...prev, [name]: undefined }));
        } catch (error) {
            setErrors(prev => ({ ...prev, [name]: error.message }));
        }
    };

    const isButtonDisabled = !shippingInfo.shipping_method;

    return (
        <div className={classes.shipping_info}>
            <h1 className="custom_h1 mb-3">Shipping Information</h1>
            <form onSubmit={handleSubmit}>
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
                                    onChange={handleInputChangeWithValidation}
                                />
                                <label htmlFor={`method_${method.id}`} className={classes.radio_label}>
                                    {method.name} - ${method.price}
                                </label>
                            </div>
                        ))
                    )}
                    {errors.shipping_method && (
                        <div className={classes.error_message}>{errors.shipping_method}</div>
                    )}
                </div>

                <div className={`${classes.form_group} ${!shippingInfo.shipping_method ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.full_name ? classes.error : ''}`}
                        id="full_name"
                        name="full_name"
                        value={shippingInfo.full_name}
                        onChange={handleInputChangeWithValidation}
                        placeholder="Full Name"
                        error={errors.full_name}
                    />
                </div>

                <div className={`${classes.form_group} ${!shippingInfo.shipping_method ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.shipping_phone ? classes.error : ''}`}
                        id="shipping_phone"
                        name="shipping_phone"
                        value={shippingInfo.shipping_phone}
                        onChange={handleInputChangeWithValidation}
                        placeholder="Phone Number"
                        error={errors.shipping_phone}
                    />
                </div>

                {/* Address fields for Correos */}
                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.province ? classes.error : ''}`}
                        id="province"
                        name="province"
                        value={shippingInfo.province}
                        onChange={handleInputChangeWithValidation}
                        placeholder="Province"
                        error={errors.province}
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.canton ? classes.error : ''}`}
                        id="canton"
                        name="canton"
                        value={shippingInfo.canton}
                        onChange={handleInputChangeWithValidation}
                        placeholder="Canton"
                        error={errors.canton}
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.district ? classes.error : ''}`}
                        id="district"
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleInputChangeWithValidation}
                        placeholder="District"
                        error={errors.district}
                    />
                </div>

                <div className={`${classes.form_group} ${!isCorreosMethod(shippingInfo.shipping_method) ? classes.hidden : ''}`}>
                    <Input
                        type="text"
                        className={`${classes.form_control} ${errors.exact_address ? classes.error : ''}`}
                        id="exact_address"
                        name="exact_address"
                        value={shippingInfo.exact_address}
                        onChange={handleInputChangeWithValidation}
                        placeholder="Exact Address"
                        error={errors.exact_address}
                    />
                </div>

                <div className={`${classes.button_container} mt-2`}>
                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                    >
                        Review Order
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ShippingInfo; 