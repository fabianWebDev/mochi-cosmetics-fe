export const validateCart = (cart) => {
    const errors = [];

    if (!cart || !cart.items || cart.items.length === 0) {
        errors.push('Your cart is empty');
        return errors;
    }

    for (const item of cart.items) {
        if (!item.product) {
            errors.push('Invalid product in cart');
            continue;
        }

        if (!item.quantity || item.quantity <= 0) {
            errors.push(`Invalid quantity for ${item.product.name}`);
            continue;
        }

        if (item.quantity > item.product.stock) {
            errors.push(`Not enough stock for ${item.product.name}. Available: ${item.product.stock}`);
        }
    }

    return errors;
}; 