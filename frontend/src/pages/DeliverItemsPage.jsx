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
    const [otpInputs, setOtpInputs] = useState({});


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

    const handleCompleteOrder = async (orderId, otp) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ otp })
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Order completed successfully');
                fetchOrders(); // Refresh orders list
            } else {
                alert(data.message || 'Error completing order');
            }
        } catch (error) {
            alert('Error completing order');
        }
    };
    const handleOtpSubmit = async (orderId) => {
        try {
            const otp = otpInputs[orderId];
            if (!otp) {
                alert('Please enter OTP');
                return;
            }

            const response = await fetch(`/api/orders/${orderId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ otp })
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Order completed successfully');
                setOtpInputs(prev => {
                    const newInputs = {...prev};
                    delete newInputs[orderId];
                    return newInputs;
                });
                fetchOrders(); // Refresh orders list
            } else {
                alert(data.message || 'Invalid OTP');
            }
        } catch (error) {
            alert('Error completing order');
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
                <Heading>Delivery Orders</Heading>
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
                                mt={4}
                                placeholder="Enter OTP from buyer"
                                value={otpInputs[order._id] || ''}
                                onChange={(e) => setOtpInputs(prev => ({
                                    ...prev,
                                    [order._id]: e.target.value
                                }))}
                            />
                            <Button
                                mt={2}
                                colorScheme="teal"
                                onClick={() => handleOtpSubmit(order._id)}
                                isDisabled={!otpInputs[order._id]}
                                w="full"
                            >
                                Verify & Complete Order
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