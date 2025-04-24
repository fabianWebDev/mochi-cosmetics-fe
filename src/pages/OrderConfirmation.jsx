import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import styles from './OrderConfirmation.module.css';

const OrderHeader = ({ orderId }) => (
    <div className={styles.order_header}>
        <i className={`bi bi-check-circle ${styles.success_icon}`}></i>
        <h1>Thank You for Your Order!</h1>
        <p>Order #{orderId}</p>
    </div>
);

const ShippingInfo = ({ shippingAddress, isPickup }) => {
    if (isPickup) {
        return <p><strong>Pick up in store</strong></p>;
    }

    const shippingLines = shippingAddress.split('\n');
    const fullName = shippingLines[0];
    const address = shippingLines[1];
    const cityPostal = shippingLines[2]?.split(',');
    const city = cityPostal ? cityPostal[0].trim() : '';
    const postalCode = cityPostal && cityPostal[1] ? cityPostal[1].trim() : '';
    const phone = shippingLines[3]?.replace('Phone:', '').trim() || '';

    return (
        <div className={styles.shipping_info}>
            <h3 className={styles.section_title}>Shipping Information</h3>
            <p><strong>Name:</strong> {fullName}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>City:</strong> {city}</p>
            <p><strong>Postal Code:</strong> {postalCode}</p>
            <p><strong>Phone:</strong> {phone}</p>
        </div>
    );
};

const OrderDetails = ({ order }) => (
    <div className={styles.order_details}>
        <h3 className={styles.section_title}>Order Details</h3>
        <p><strong>Order Status:</strong> {order.status}</p>
        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ${Number(order.total_price).toFixed(2)}</p>
    </div>
);

const OrderItems = ({ items }) => (
    <div className={styles.order_items}>
        <h3 className={styles.section_title}>Order Items</h3>
        <div className="table-responsive">
            <table className={styles.items_table}>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
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
);

const ActionButtons = () => (
    <div className={styles.action_buttons}>
        <Link to="/products" className={styles.continue_button}>
            Continue Shopping
        </Link>
        <Link to="/orders" className={styles.view_orders_button}>
            View All Orders
        </Link>
    </div>
);

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                toast.dismiss();
                if (!authService.isAuthenticated()) {
                    toast.error('Please login to view order details');
                    navigate('/login');
                    return;
                }

                const orderData = await orderService.getOrderById(orderId);
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                if (error.response?.status === 401) {
                    toast.dismiss();
                    toast.error('Session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                toast.dismiss();
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

    if (loading) return <div className="mt-4">Loading...</div>;
    if (!order) return <div className="mt-4">Order not found</div>;

    return (
        <div className="row justify-content-center mt-2">
            <div className={`${styles.order_confirmation} col-12 col-md-8 col-lg-8 col-xl-8`}>
                <OrderHeader orderId={order.order_id} />
                <div className="row">
                <div className="col-md-8">
                    <ShippingInfo 
                        shippingAddress={order.shipping_address} 
                        isPickup={order.pickup} 
                    />
                </div>
                <div className="col-md-4">
                    <OrderDetails order={order} />
                </div>
            </div>
            {order.items && order.items.length > 0 && (
                <OrderItems items={order.items} />
            )}
                <ActionButtons />
            </div>
        </div>
    );
};

export default OrderConfirmation; 