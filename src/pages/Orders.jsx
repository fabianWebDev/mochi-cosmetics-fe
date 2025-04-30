import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import styles from './Orders.module.css';

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
        console.log('Fetched orders:', data);
        setOrders(data);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    console.log('Orders state updated:', orders);
  }, [orders]);

  if (loading) {
    return (
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-8 col-lg-8 col-xl-8">
          <div className={styles.loading_container}>
            <h6 className={styles.loading_text}>Loading orders...</h6>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-3">
      <div className={`${styles.orders_container} col-12 col-md-8 col-lg-8 col-xl-8`}>
        <h1 className={`${styles.orders_title} custom_h1 mb-3`}>Order History</h1>
        <table className={styles.table_container}>
          <thead className={styles.table_header}>
            <tr>
              <th className={`${styles.table_header_cell} text-center`}>Order ID</th>
              <th className={`${styles.table_header_cell} text-center`}>Date</th>
              <th className={`${styles.table_header_cell} text-center`}>Total</th>
              <th className={`${styles.table_header_cell} text-center`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.empty_orders}>
                  No orders to display
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id} className={styles.table_row}>
                  <td className={`${styles.table_cell} text-center`}>
                    <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
                      {order.order_id}
                    </Link>
                  </td>
                  <td className={`${styles.table_cell} text-center`}>
                    <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Link>
                  </td>
                  <td className={`${styles.table_cell} text-center`}>
                    <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
                      ${order.total_price}
                    </Link>
                  </td>
                  <td className={`${styles.table_cell} text-center`}>
                    <Link to={`/orders/${order.order_id}`} className={styles.order_link}>
                      {order.status}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
