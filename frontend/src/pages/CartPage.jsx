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
                console.log('Cart items:', data.data); // Debug log
                setCartItems(data.data);
                calculateTotal(data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };
               const handleCheckout = async () => {
            try {
                console.log('Attempting checkout with cart items:', cartItems);
                
                for (const item of cartItems) {
                    console.log('Processing item:', item); // Full item log
                    
                    // Get seller ID from the item's SellerID field
                    const sellerId = typeof item.SellerID === 'string' ? item.SellerID : item.SellerID?._id;
                    
                    if (!sellerId) {
                        throw new Error(`No seller ID found for product ${item.name}`);
                    }
        
                    const orderData = {
                        productId: item._id,
                        sellerId: sellerId,
                        amount: parseFloat(item.price)
                    };
        
                    console.log('Sending order data:', orderData);
        
                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(orderData)
                    });
        
                    const data = await response.json();
                    console.log('Order creation response:', data);
                    
                    if (!data.success) {
                        throw new Error(data.message || 'Failed to create order');
                    }
                }
        
                // Clear cart
                await fetch('/api/users/cart', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
        
                setCartItems([]);
                setTotalAmount(0);
                alert('Orders placed successfully! Check your orders page for OTPs.');
        
            } catch (error) {
                console.error('Checkout error:', error);
                alert(`Error placing orders: ${error.message}`);
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
                        <Button colorScheme="teal" size="lg" onClick={handleCheckout}>
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