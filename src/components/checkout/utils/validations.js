export const validateShippingInfo = (shippingInfo) => {
    const errors = [];
    if (!shippingInfo.full_name.trim()) errors.push('Full name is required');
    if (!shippingInfo.shipping_method) errors.push('Please select a shipping method');

    // For Store Pickup (id = 1), only require name and phone
    if (shippingInfo.shipping_method === '1') {
        if (!shippingInfo.shipping_phone.trim()) errors.push('Phone number is required for pickup');
    } 
    // For Correos de Costa Rica (id = 2), require all fields
    else if (shippingInfo.shipping_method === '2') {
        if (!shippingInfo.province.trim()) errors.push('Province is required');
        if (!shippingInfo.canton.trim()) errors.push('Canton is required');
        if (!shippingInfo.district.trim()) errors.push('District is required');
        if (!shippingInfo.exact_address.trim()) errors.push('Exact address is required');
        if (!shippingInfo.shipping_phone.trim()) errors.push('Phone number is required');
    }
    return errors;
};

export const validateCart = (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
        return ['Cart is empty'];
    }
    return [];
}; 