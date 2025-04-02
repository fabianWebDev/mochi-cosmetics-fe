export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

export const PROGRESS_STEPS = {
    CREATING: 1,
    PROCESSING: 2,
    COMPLETED: 3
};

export const INITIAL_SHIPPING_INFO = {
    province: '',
    canton: '',
    district: '',
    exact_address: '',
    shipping_phone: '',
    full_name: '',
    pickup: false
}; 