import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import OrderInfo from '../../components/orders/detail/OrderInfo';
import CancelOrderModal from '../../components/orders/detail/CancelOrderModal';
import LoadingState from '../../components/orders/detail/LoadingState';
import NotFoundState from '../../components/orders/detail/NotFoundState';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await orderService.getOrderById(orderId);
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Error loading order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleCancelOrder = async () => {
        try {
            // First update the stock for each product
            for (const item of orderDetails.items) {
                await orderService.updateProductStock(
                    item.product,
                    item.quantity,
                    'increase'
                );
            }

            // Then cancel the order
            await orderService.cancelOrder(orderId);

            // Refresh order details after cancellation
            const updatedOrder = await orderService.getOrderById(orderId);
            setOrderDetails(updatedOrder);
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error canceling order:', error);
            setError('Error canceling order');
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (!orderDetails) {
        return <NotFoundState />;
    }

    const canCancelOrder = orderDetails.status === 'pending';

    return (
        <div className="row justify-content-center mt-3">
            <div className={`col-12 col-md-8 col-lg-8 col-xl-8`}>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <OrderInfo
                    orderDetails={orderDetails}
                    onCancelClick={() => setShowCancelModal(true)}
                    canCancelOrder={canCancelOrder}
                />
            </div>
            <CancelOrderModal
                show={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
            />
        </div>
    );
};

export default OrderDetail;
