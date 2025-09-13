import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import OrderDetailLayout from '../../components/orders/detail/OrderDetailLayout';
import CancelOrderModal from '../../components/orders/detail/CancelOrderModal';
import Loading from '../../components/ui/common/Loading';
import NotFoundState from '../../components/orders/detail/NotFoundState';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!orderId) {
                    toast.error('Invalid order ID');
                    navigate('/orders');
                    return;
                }

                const data = await orderService.getOrderById(orderId);
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                if (error.response?.status === 404) {
                    toast.error('Order not found');
                    navigate('/orders');
                    return;
                }
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                setError('Error loading order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId, navigate]);

    const handleCancelOrder = async () => {
        try {
            // First update the stock for each product
            for (const item of orderDetails.items) {
                // Get current product details to know the current stock
                const productDetails = await productService.getProduct(item.product);
                const currentStock = productDetails.stock;
                // Add the cancelled order quantity back to stock
                const newStock = currentStock + item.quantity;
                await orderService.updateProductStock(
                    item.product,
                    newStock
                );
            }

            // Then cancel the order
            await orderService.cancelOrder(orderId);

            // Refresh order details after cancellation
            const updatedOrder = await orderService.getOrderById(orderId);
            setOrderDetails(updatedOrder);
            setShowCancelModal(false);
            toast.success('Order cancelled successfully');
        } catch (error) {
            console.error('Error canceling order:', error);
            toast.error('Error canceling order');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!orderDetails) {
        return <NotFoundState />;
    }

    const canCancelOrder = orderDetails.status === 'pending';

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className={`col-12 col-md-8 col-lg-8 col-xl-8 margin_auto`}>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <OrderDetailLayout
                        order={orderDetails}
                        onCancelClick={() => setShowCancelModal(true)}
                        canCancelOrder={canCancelOrder}
                    />
                </div>
                <CancelOrderModal
                    show={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancelOrder}
                />
            </SecondaryFrame>
        </MainFrame>
    );
};

export default OrderDetail;
