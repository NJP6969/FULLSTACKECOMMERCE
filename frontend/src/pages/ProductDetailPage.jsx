import React, { useState, useEffect } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    Text, 
    Button, 
    Box,
    HStack
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();
                if (data.success) {
                    setProduct(data.data);
                }
            } catch (error) {
                alert('Error fetching product details');
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const response = await fetch('/api/users/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: id })
            });
            const data = await response.json();
            if (data.success) {
                alert('Added to cart successfully');
            }
        } catch (error) {
            alert('Error adding to cart');
        }
    };

    if (!product) return <Text>Loading...</Text>;

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Box borderBottom="2px solid" borderColor="gray.200" pb={4}>
                    <Heading size="xl" mb={2}>{product.name}</Heading>
                    <Text color="gray.500" fontSize="lg">Category: {product.Category}</Text>
                </Box>
                
                <Box borderBottom="2px solid" borderColor="gray.200" pb={4}>
                    <Text fontSize="2xl" fontWeight="bold">₹{product.price}</Text>
                </Box>
                
                <Box borderBottom="2px solid" borderColor="gray.200" pb={4}>
                    <Heading size="md" mb={2}>Description</Heading>
                    <Text>{product.Description}</Text>
                </Box>
                
                <Box borderBottom="2px solid" borderColor="gray.200" pb={4}>
                    <Heading size="md" mb={2}>Seller Information</Heading>
                    <Text>
                        {product.SellerID?.firstName} {product.SellerID?.lastName}
                    </Text>
                    <Text>Contact: {product.SellerID?.contactNumber}</Text>
                </Box>

                <HStack spacing={4}>
                    {product.SellerID?._id !== user?._id && (
                        <Button colorScheme="teal" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    )}
                    <Button onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </HStack>
            </VStack>
        </Container>
    );
};

export default ProductDetailPage;