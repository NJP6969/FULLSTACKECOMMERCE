import React, { useState, useEffect } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    SimpleGrid, 
    Text,
    Button,
    Box
} from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/users/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setCartItems(data.data);
                calculateTotal(data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + Number(item.price), 0);
        setTotalAmount(total);
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await fetch(`/api/users/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                fetchCart(); // Refresh cart after removing item
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
                <Heading>Your Cart</Heading>
                {cartItems.length > 0 ? (
                    <>
                        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                            {cartItems.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product}
                                    inCart={true} // Pass inCart prop to ProductCard
                                    onRemove={() => handleRemoveFromCart(product._id)}
                                />
                            ))}
                        </SimpleGrid>
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold">Total: ₹{totalAmount}</Text>
                        </Box>
                        <Button colorScheme="teal" size="lg">
                            Proceed to Checkout
                        </Button>
                    </>
                ) : (
                    <Text>Your cart is empty</Text>
                )}
            </VStack>
        </Container>
    );
};

export default CartPage;