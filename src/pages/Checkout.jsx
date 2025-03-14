import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        shipping_address: '',
        shipping_city: '',
        shipping_postal_code: '',
        shipping_phone: '',
        full_name: ''
    });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Verificar autenticación y obtener información del usuario
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Please login to proceed with checkout');
            navigate('/login');
            return;
        }

        // Obtener ID del usuario del token JWT
        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            setUserId(tokenPayload.user_id);
        } catch (error) {
            console.error('Error decoding token:', error);
            toast.error('Error loading user data');
            navigate('/login');
            return;
        }

        // Cargar carrito
        const savedCart = localStorage.getItem('cart');
        if (!savedCart || JSON.parse(savedCart).items.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }
        setCart(JSON.parse(savedCart));
        setLoading(false);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateShippingInfo = () => {
        const errors = [];
        if (!shippingInfo.full_name.trim()) errors.push('Full name is required');
        if (!shippingInfo.shipping_address.trim()) errors.push('Shipping address is required');
        if (!shippingInfo.shipping_city.trim()) errors.push('City is required');
        if (!shippingInfo.shipping_postal_code.trim()) errors.push('Postal code is required');
        if (!shippingInfo.shipping_phone.trim()) errors.push('Phone number is required');
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
        setIsSubmitting(true);
        
        // Validar información de envío
        const shippingErrors = validateShippingInfo();
        if (shippingErrors.length > 0) {
            shippingErrors.forEach(error => toast.error(error));
            setIsSubmitting(false);
            return;
        }

        // Validar carrito
        const cartErrors = validateCart();
        if (cartErrors.length > 0) {
            cartErrors.forEach(error => toast.error(error));
            setIsSubmitting(false);
            return;
        }

        if (!userId) {
            toast.error('User information not loaded');
            setIsSubmitting(false);
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
            const response = await orderService.createOrder(orderData);

            // Actualizar el stock de los productos
            for (const item of cart.items) {
                try {
                    await orderService.updateProductStock(
                        item.product.id,
                        item.quantity,
                        'decrease'
                    );
                } catch (error) {
                    console.error(`Error updating stock for product ${item.product.id}:`, error);
                    toast.error(`Error updating stock for ${item.product.name}`);
                    // Revertir la orden si hay error al actualizar el stock
                    await orderService.deleteOrder(response.data.order_id);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Limpiar el carrito usando el servicio
            await cartService.clearCart();
            
            // Mostrar mensaje de éxito
            toast.success('Order placed successfully!');
            
            // Redirigir a la página de confirmación
            navigate(`/order-confirmation/${response.data.order_id}`);

        } catch (error) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
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

    const retryOperation = async (operation, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    };

    const validateOrder = (order) => {
        const errors = [];
        if (!order.order_id) errors.push('ID de orden requerido');
        if (!order.total_amount || order.total_amount <= 0) errors.push('Total inválido');
        if (!order.status) errors.push('Estado requerido');
        return errors;
    };

    if (loading) return <LoadingState />;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Checkout</h1>
            <div className="row">
                {/* Formulario de envío */}
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Shipping Information</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="full_name"
                                        name="full_name"
                                        value={shippingInfo.full_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="shipping_address" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shipping_address"
                                        name="shipping_address"
                                        value={shippingInfo.shipping_address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="shipping_city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="shipping_city"
                                            name="shipping_city"
                                            value={shippingInfo.shipping_city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="shipping_postal_code" className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="shipping_postal_code"
                                            name="shipping_postal_code"
                                            value={shippingInfo.shipping_postal_code}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="shipping_phone" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="shipping_phone"
                                        name="shipping_phone"
                                        value={shippingInfo.shipping_phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Order Summary</h3>
                            {cart?.items.map((item) => (
                                <div key={item.product.id} className="d-flex justify-content-between mb-2">
                                    <div>
                                        <h6 className="mb-0">{item.product.name}</h6>
                                        <small className="text-muted">Quantity: {item.quantity}</small>
                                    </div>
                                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between">
                                <h5>Total:</h5>
                                <h5>${calculateTotal().toFixed(2)}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingState = () => (
    <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
);

const OrderDetails = ({ order }) => (
    <tr key={order.id}>
        <td>{order.order_id}</td>
        <td>{new Date(order.created_at).toLocaleDateString()}</td>
        <td>${order.total_amount}</td>
        <td>
            <span className={`badge bg-${getStatusColor(order.status)}`}>
                {order.status}
            </span>
        </td>
        <td>
            <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleViewDetails(order.id)}
            >
                Ver Detalles
            </button>
        </td>
    </tr>
);

const getStatusColor = (status) => {
    const colors = {
        [ORDER_STATUS.PENDING]: 'warning',
        [ORDER_STATUS.PROCESSING]: 'info',
        [ORDER_STATUS.SHIPPED]: 'primary',
        [ORDER_STATUS.DELIVERED]: 'success',
        [ORDER_STATUS.CANCELLED]: 'danger'
    };
    return colors[status] || 'secondary';
};

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders();
            setOrders(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { orders, loading, error, fetchOrders };
};

export default Checkout;
