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
    // These fields are only required for Correos de Costa Rica (shipping_method === '2')
    province: Yup.string()
        .when('shipping_method', {
            is: '2',
            then: (schema) => schema.required('Province is required'),
            otherwise: (schema) => schema.notRequired()
        }),
    canton: Yup.string()
        .when('shipping_method', {
            is: '2',
            then: (schema) => schema.required('Canton is required'),
            otherwise: (schema) => schema.notRequired()
        }),
    district: Yup.string()
        .when('shipping_method', {
            is: '2',
            then: (schema) => schema.required('District is required'),
            otherwise: (schema) => schema.notRequired()
        }),
    exact_address: Yup.string()
        .when('shipping_method', {
            is: '2',
            then: (schema) => schema.required('Exact address is required'),
            otherwise: (schema) => schema.notRequired()
        })
}); 