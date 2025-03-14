import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const orderService = {
  async createOrder(orderData) {
    return axios.post(
      `${BASE_URL}/api/orders/`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },
  
  async updateProductStock(productId, quantity, operation) {
    return axios.put(
      `${BASE_URL}/api/products/${productId}/update-stock/`,
      { quantity, operation },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderProgress, setOrderProgress] = useState({
    step: 1,
    status: 'processing',
    message: 'Creating your order...'
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/my-orders/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            navigate('/login');
            return;
          }
          throw new Error('Error al cargar las órdenes');
        }

        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data);
      } catch (error) {
        console.error('Error al cargar las órdenes:', error);
        toast.error('Error al cargar las órdenes. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    console.log('Orders state updated:', orders);
  }, [orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // ... código existente ...
    } catch (error) {
      // ... manejo de errores ...
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guardar el estado de la orden en caso de fallo
  const saveOrderState = (orderData) => {
    localStorage.setItem('pendingOrder', JSON.stringify({
      orderData,
      timestamp: new Date().getTime()
    }));
  };

  // Limpiar el estado de la orden después de completar
  const clearOrderState = () => {
    localStorage.removeItem('pendingOrder');
  };

  // Verificar la validez del token
  const checkTokenValidity = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000; // Convertir a milisegundos
        return Date.now() < expiration;
    } catch (error) {
        return false;
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6">Cargando órdenes...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Órdenes
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID de Orden</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay órdenes para mostrar
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.order_id} hover>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total_price}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.items?.length || 0} productos
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Orders;
