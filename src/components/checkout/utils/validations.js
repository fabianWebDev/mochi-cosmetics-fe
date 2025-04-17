export const validateShippingInfo = (shippingInfo) => {
    const errors = [];
    if (!shippingInfo.full_name.trim()) errors.push('Full name is required');
    if (!shippingInfo.province.trim() && !shippingInfo.pickup) errors.push('Province is required if not picking up');
    if (!shippingInfo.canton.trim() && !shippingInfo.pickup) errors.push('Canton is required if not picking up');
    if (!shippingInfo.district.trim() && !shippingInfo.pickup) errors.push('District is required if not picking up');
    if (!shippingInfo.exact_address.trim() && !shippingInfo.pickup) errors.push('Exact address is required if not picking up');
    if (!shippingInfo.shipping_phone.trim() && !shippingInfo.pickup) errors.push('Phone number is required if not picking up');
    return errors;
};

export const validateCart = (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
        return ['Cart is empty'];
    }
    return [];
}; 