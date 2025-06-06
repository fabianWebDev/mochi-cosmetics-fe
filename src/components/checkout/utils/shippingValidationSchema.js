import * as Yup from 'yup';

export const shippingValidationSchema = Yup.object().shape({
    shipping_method: Yup.string()
        .required('Please select a shipping method'),
    full_name: Yup.string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),
    shipping_phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .length(8, 'Phone number must be exactly 8 digits'),
    province: Yup.string()
        .required('Province is required'),
    canton: Yup.string()
        .required('Canton is required'),
    district: Yup.string()
        .required('District is required'),
    exact_address: Yup.string()
        .required('Exact address is required')
});