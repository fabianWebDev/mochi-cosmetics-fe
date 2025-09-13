import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';

// Import modular components
import OrderConfimationLayout from '../../components/orders/confirmation/OrderConfimationLayout';
import Loading from '../../components/ui/common/Loading';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

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

                if (!orderId) {
                    toast.error('Invalid order ID');
                    navigate('/orders');
                    return;
                }

                const orderData = await orderService.getOrderById(orderId);
                if (!orderData) {
                    toast.error('Order not found');
                    navigate('/orders');
                    return;
                }

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
                if (error.response?.status === 404) {
                    toast.dismiss();
                    toast.error('Order not found');
                    navigate('/orders');
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

    if (loading) return <div className="mt-4"><Loading /></div>;
    if (!order) return <div className="mt-4">Order not found</div>;

    return (
        <MainFrame>
            <SecondaryFrame>
            <div className={`col-12 col-md-8 col-lg-8 col-xl-8 margin_auto`}>
                <OrderConfimationLayout order={order} />
            </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default OrderConfirmation; 