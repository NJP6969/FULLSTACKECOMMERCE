import React, { useState, useEffect } from 'react';
import {
    Container,
    VStack,
    Heading,
    Box,
    Text,
    SimpleGrid,
    Button,
    Input
} from '@chakra-ui/react';

const DeliverItemsPage = () => {
    const [orders, setOrders] = useState([]);
    const [otps, setOtps] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/deliver-orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Error fetching orders');
        }
    };

    const handleOtpChange = (orderId, value) => {
        setOtps(prev => ({
            ...prev,
            [orderId]: value
        }));
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ otp: otps[orderId] })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Order completed successfully');
                fetchOrders();
            } else {
                alert(data.message || 'Error completing order');
            }
        } catch (error) {
            alert('Error completing order');
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
                <Heading>Deliver Items</Heading>
                <SimpleGrid columns={[1, 2]} spacing={4} w="100%">
                    {orders.map(order => (
                        <Box 
                            key={order._id} 
                            p={4} 
                            borderWidth="1px" 
                            borderRadius="lg"
                        >
                            <Text>Product: {order.productId.name}</Text>
                            <Text>Price: ₹{order.amount}</Text>
                            <Text>Buyer: {order.buyerId.firstName} {order.buyerId.lastName}</Text>
                            <Input
                                mt={2}
                                placeholder="Enter OTP"
                                value={otps[order._id] || ''}
                                onChange={(e) => handleOtpChange(order._id, e.target.value)}
                            />
                            <Button
                                mt={2}
                                colorScheme="teal"
                                onClick={() => handleCompleteOrder(order._id)}
                            >
                                Complete Order
                            </Button>
                        </Box>
                    ))}
                </SimpleGrid>
                {orders.length === 0 && (
                    <Text>No pending deliveries</Text>
                )}
            </VStack>
        </Container>
    );
};

export default DeliverItemsPage;