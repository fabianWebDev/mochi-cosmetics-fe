import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Container, Typography, Paper, List, ListItem } from '@mui/material';

const OrderDetal = () => {
    const { orderId } = useParams(); // Obtener el ID de la orden de los parámetros de la URL
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await orderService.getOrderById(orderId);
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <Container>
                <Typography variant="h6">Loading order details...</Typography>
            </Container>
        );
    }

    if (!orderDetails) {
        return (
            <Container>
                <Typography variant="h6">Order not found.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Order Details - ID: {orderDetails.order_id}
            </Typography>
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Status: {orderDetails.status}</Typography>
                <Typography variant="h6">Total: ${orderDetails.total_price}</Typography>
                <Typography variant="h6">Date: {new Date(orderDetails.created_at).toLocaleDateString()}</Typography>
                <Typography variant="h6">Products:</Typography>
                <List>
                    {orderDetails.items.map((item) => (
                        <ListItem key={item.product_id}>
                            {item.product_name} - Quantity: {item.quantity}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default OrderDetal;
