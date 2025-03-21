import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import ProgressBar from '../components/ui/ProgressBar';

const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const PROGRESS_STEPS = {
    CREATING: 1,
    PROCESSING: 2,
    COMPLETED: 3
};

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
        province: '',
        canton: '',
        district: '',
        exact_address: '',
        shipping_phone: '',
        full_name: '',
        pickup: false
    });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Verificar autenticación y obtener información del usuario
        if (!authService.isAuthenticated()) {
            toast.error('Please login to proceed with checkout');
            navigate('/login');
            return;
        }

        const user = authService.getUser();
        if (!user || !user.id) {
            toast.error('Error loading user data');
            navigate('/login');
            return;
        }
        setUserId(user.id);

        // Cargar carrito usando el servicio
        const cartItems = cartService.getCartItems();
        if (!cartItems || cartItems.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }
        setCart({ items: cartItems });
        setLoading(false);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validar información de envío solo si no se elige "Pick up in Store"
            if (!shippingInfo.pickup) {
                const errors = validateShippingInfo();
                if (errors.length > 0) {
                    errors.forEach(error => toast.error(error));
                    return;
                }
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const validateShippingInfo = () => {
        const errors = [];
        if (!shippingInfo.full_name.trim()) errors.push('Full name is required');
        if (!shippingInfo.province.trim() && !shippingInfo.pickup) errors.push('Province is required if not picking up');
        if (!shippingInfo.canton.trim() && !shippingInfo.pickup) errors.push('Canton is required if not picking up');
        if (!shippingInfo.district.trim() && !shippingInfo.pickup) errors.push('District is required if not picking up');
        if (!shippingInfo.exact_address.trim() && !shippingInfo.pickup) errors.push('Exact address is required if not picking up');
        if (!shippingInfo.shipping_phone.trim() && !shippingInfo.pickup) errors.push('Phone number is required if not picking up');
        return errors;
    };

    const validateCart = () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            return ['Cart is empty'];
        }
        return [];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar información de envío
        const shippingErrors = validateShippingInfo();
        if (shippingErrors.length > 0) {
            shippingErrors.forEach(error => toast.error(error));
            return;
        }

        // Validar carrito
        const cartErrors = validateCart();
        if (cartErrors.length > 0) {
            cartErrors.forEach(error => toast.error(error));
            return;
        }

        if (!userId) {
            toast.error('User information not loaded');
            return;
        }

        try {
            // Crear el objeto de orden
            const orderData = {
                user: userId,
                status: ORDER_STATUS.PENDING,
                total_price: calculateTotal(),
                shipping_address: `${shippingInfo.full_name}\n${shippingInfo.shipping_address}\n${shippingInfo.shipping_city}, ${shippingInfo.shipping_postal_code}\nPhone: ${shippingInfo.shipping_phone}`,
                items: cart.items.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price_at_time: item.product.price
                }))
            };

            console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));

            // Enviar la orden al backend usando el servicio
            const order = await orderService.createOrder(orderData);

            if (!order || !order.order_id) {
                throw new Error('Invalid order response from server');
            }

            // Actualizar el stock de los productos
            for (const item of cart.items) {
                try {
                    await orderService.updateProductStock(
                        item.product.id,
                        item.quantity,
                        'decrease'
                    );
                } catch (error) {
                    toast.error(`Error updating stock for ${item.product.name}`);
                    // Revertir la orden si hay error al actualizar el stock
                    await orderService.deleteOrder(order.order_id);
                    return;
                }
            }

            // Limpiar el carrito usando el servicio
            await cartService.clearCart();

            // Mostrar mensaje de éxito
            toast.success('Order placed successfully!');

            // Redirigir a la página de confirmación
            navigate(`/order-confirmation/${order.order_id}`);

        } catch (error) {
            handleError(error);
        }
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        ) || 0;
    };

    const handleError = (error) => {
        console.error('Checkout error:', error);

        if (error.response) {
            const errorData = error.response.data;
            console.error('Error response data:', errorData);

            switch (error.response.status) {
                case 400:
                    // Manejar errores de validación
                    if (typeof errorData === 'object') {
                        Object.entries(errorData).forEach(([field, messages]) => {
                            toast.error(`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
                        });
                    } else {
                        toast.error(errorData);
                    }
                    break;
                case 401:
                    toast.error('Session expired. Please login again.');
                    navigate('/login');
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error('Order not found.');
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    toast.error('Error processing your request.');
            }
        } else if (error.request) {
            toast.error('Could not connect to the server.');
        } else {
            toast.error('Error processing your request.');
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <ProgressBar currentStep={currentStep} totalSteps={3} />
            <h1 className="mb-4">Checkout</h1>
            {currentStep === 1 && (
                <div>
                    <h3>Shipping Information</h3>
                    <form onSubmit={handleNextStep}>
                        <div className="mb-3">
                            <label htmlFor="full_name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="full_name"
                                name="full_name"
                                value={shippingInfo.full_name}
                                onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                                Pick up in store
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Next</button>
                    </form>
                </div>
            )}
            {currentStep === 2 && (
                <div>
                    <h3>Order Summary</h3>
                    {cart?.items.map((item) => (
                        <div key={item.product.id} className="d-flex justify-content-between mb-2">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong>${calculateTotal().toFixed(2)}</strong>
                    </div>
                    <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">Back</button>
                    <button onClick={handleNextStep} className="btn btn-primary">Next</button>
                </div>
            )}
            {currentStep === 3 && (
                <div>
                    <h3>Payment Method</h3>
                    <p>Currently, the only payment method available is SINPE Móvil.</p>
                    <button onClick={handleSubmit} className="btn btn-primary">Place Order</button>
                    <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">Back</button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
