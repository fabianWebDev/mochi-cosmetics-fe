import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Verificar autenticación
                if (!authService.isAuthenticated()) {
                    toast.error('Please login to view order details');
                    navigate('/login');
                    return;
                }

                const orderData = await orderService.getOrderById(orderId);
                console.log('Full order data:', orderData);
                console.log('Items array:', orderData.items);
                if (orderData.items && orderData.items.length > 0) {
                    console.log('Number of items:', orderData.items.length);
                    console.log('First item full details:', orderData.items[0]);
                    console.log('Available fields in first item:', Object.keys(orderData.items[0]));
                } else {
                    console.log('No items found in order');
                }
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order - Full error:', error);
                if (error.response) {
                    console.error('Error status:', error.response.status);
                    console.error('Error data:', error.response.data);
                    console.error('Error headers:', error.response.headers);
                    
                    if (error.response.status === 401) {
                        toast.error('Session expired. Please login again.');
                        navigate('/login');
                        return;
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
                toast.error(
                    error.response?.data?.detail || 
                    error.response?.data?.error || 
                    'Error fetching order details'
                );
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (!order) return <div className="container mt-4">Order not found</div>;

    const shippingLines = order.shipping_address.split('\n');
    const fullName = shippingLines[0];
    const address = shippingLines[1];
    const cityPostal = shippingLines[2]?.split(',');
    const city = cityPostal ? cityPostal[0].trim() : '';
    const postalCode = cityPostal && cityPostal[1] ? cityPostal[1].trim() : '';
    const phone = shippingLines[3]?.replace('Phone:', '').trim() || '';

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                        <h1 className="mt-3">Thank You for Your Order!</h1>
                        <p className="lead">Order #{order.order_id}</p>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <h3>Shipping Information</h3>
                            {order.pickup ? (
                                <p><strong>Pick up in store</strong></p>
                            ) : (
                                <>
                                    <p><strong>Name:</strong> {fullName}</p>
                                    <p><strong>Address:</strong> {address}</p>
                                    <p><strong>City:</strong> {city}</p>
                                    <p><strong>Postal Code:</strong> {postalCode}</p>
                                    <p><strong>Phone:</strong> {phone}</p>
                                </>
                            )}
                        </div>
                        <div className="col-md-6">
                            <h3>Order Details</h3>
                            <p><strong>Order Status:</strong> {order.status}</p>
                            <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <p><strong>Total Amount:</strong> ${Number(order.total_price).toFixed(2)}</p>
                        </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                        <div className="mt-4">
                            <h3>Order Items</h3>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item?.id || Math.random()}>
                                                <td>{item?.product_name || 'N/A'}</td>
                                                <td>{item?.quantity || 0}</td>
                                                <td>${Number(item?.price_at_time || 0).toFixed(2)}</td>
                                                <td>${((item?.quantity || 0) * Number(item?.price_at_time || 0)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/products" className="btn btn-primary me-3">
                            Continue Shopping
                        </Link>
                        <Link to="/orders" className="btn btn-outline-primary">
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 