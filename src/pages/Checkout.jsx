import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://127.0.0.1:8000';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            toast.error('User information not loaded');
            return;
        }

        try {
            // Crear el objeto de orden
            const orderData = {
                user: userId,
                status: 'pending',
                total_price: calculateTotal(),
                shipping_address: `${shippingInfo.full_name}\n${shippingInfo.shipping_address}\n${shippingInfo.shipping_city}, ${shippingInfo.shipping_postal_code}\nPhone: ${shippingInfo.shipping_phone}`,
                items: cart.items.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price_at_time: item.product.price
                }))
            };

            console.log('Sending order data to backend:', JSON.stringify(orderData, null, 2));
            console.log('Items being sent:', JSON.stringify(orderData.items, null, 2));

            // Enviar la orden al backend
            const response = await axios.post(
                `${BASE_URL}/api/orders/`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response from backend:', JSON.stringify(response.data, null, 2));

            // Limpiar el carrito
            localStorage.removeItem('cart');
            
            // Mostrar mensaje de éxito
            toast.success('Order placed successfully!');
            
            // Redirigir a la página de confirmación
            navigate(`/order-confirmation/${response.data.order_id}`);

        } catch (error) {
            console.error('Error creating order:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Error placing order';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    // Si es un objeto de errores, formatear cada campo
                    errorMessage = Object.entries(error.response.data)
                        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                        .join('\n');
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }
            
            toast.error(errorMessage);
        }
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) => 
            total + (item.product.price * item.quantity), 0
        ) || 0;
    };

    if (loading) return <div className="container mt-4">Loading...</div>;

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
                                <button type="submit" className="btn btn-primary w-100">
                                    Place Order
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
                            {cart.items.map((item) => (
                                <div key={item.product.id} className="d-flex justify-content-between mb-2">
                                    <span>
                                        {item.product.name} x {item.quantity}
                                    </span>
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

export default Checkout;
