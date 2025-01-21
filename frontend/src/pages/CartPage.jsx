import React, { useState, useEffect } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    SimpleGrid, 
    Text,
    Button
} from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

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
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

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
                                    onRemove={fetchCart}
                                />
                            ))}
                        </SimpleGrid>
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