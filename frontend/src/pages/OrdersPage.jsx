import React, { useState, useEffect } from 'react';
import {
    Container,
    VStack,
    Heading,
    Box,
    Text,
    SimpleGrid,
    Stack,
    Button
} from '@chakra-ui/react';

const OrdersPage = () => {
    const [orders, setOrders] = useState({
        pendingOrders: [],
        boughtItems: [],
        soldItems: []
    });
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                alert('Error fetching orders');
            }
        };
        fetchOrders();
    }, []);

    const OrderCard = ({ order, isBuyer }) => (
        <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text>Transaction ID: {order.transactionId}</Text>
            <Text>Amount: ₹{order.amount}</Text>
            <Text>Product: {order.productId.name}</Text>
            <Text>Status: {order.status}</Text>
            {isBuyer && order.status === 'pending' && order.otp && (
                <Text fontWeight="bold" color="teal">Your OTP: {order.otp}</Text>
            )}
        </Box>
    );

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'pending':
    return (
        <SimpleGrid columns={[1, 2]} spacing={4}>
            {orders.pendingOrders.map(order => (
                <OrderCard 
                    key={order._id} 
                    order={order}
                    isBuyer={order.buyerId._id === JSON.parse(localStorage.getItem('user'))._id}
                />
            ))}
        </SimpleGrid>
    );
            case 'bought':
                return (
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                        {orders.boughtItems.map(order => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </SimpleGrid>
                );
            case 'sold':
                return (
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                        {orders.soldItems.map(order => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </SimpleGrid>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
                <Heading>My Orders</Heading>
                <Stack direction="row" spacing={4} w="100%" mb={4}>
                    <Button 
                        colorScheme={activeTab === 'pending' ? 'teal' : 'gray'}
                        onClick={() => setActiveTab('pending')}
                        flex={1}
                    >
                        Pending Orders
                    </Button>
                    <Button 
                        colorScheme={activeTab === 'bought' ? 'teal' : 'gray'}
                        onClick={() => setActiveTab('bought')}
                        flex={1}
                    >
                        Bought Items
                    </Button>
                    <Button 
                        colorScheme={activeTab === 'sold' ? 'teal' : 'gray'}
                        onClick={() => setActiveTab('sold')}
                        flex={1}
                    >
                        Sold Items
                    </Button>
                </Stack>
                {renderActiveTab()}
            </VStack>
        </Container>
    );
};

export default OrdersPage;