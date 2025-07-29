import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import OrdersTable from '../../components/orders/OrdersTable';
import Loading from '../../components/ui/common/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!authService.isAuthenticated()) {
          toast.dismiss();
          toast.error('Please login to view your orders');
          navigate('/login');
          return;
        }

        const data = await orderService.getOrders();

        // Ensure data is an array before sorting
        if (!Array.isArray(data)) {
          console.error('Invalid orders data:', data);
          toast.error('Error loading orders. Invalid data format.');
          setOrders([]);
          return;
        }

        // Sort orders by date, newest first
        const sortedOrders = data.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        if (error.response?.status === 401) {
          toast.dismiss();
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        toast.dismiss();
        toast.error('Error loading orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row justify-content-center mt-3">
      <div className="col-12 col-md-8 col-lg-8 col-xl-8">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default Orders;
