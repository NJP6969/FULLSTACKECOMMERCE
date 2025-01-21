import { Box, HStack, Button } from '@chakra-ui/react';
import { useProductStore } from '../store/product';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { deleteProduct } = useProductStore();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent triggering handleClick when deleting
        const result = await deleteProduct(product._id);
        if (result && result.success) {
            alert('Product deleted successfully');
        }
    };
    
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent triggering handleClick when adding to cart
        try {
            const response = await fetch('/api/users/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: product._id })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Added to cart successfully');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            alert(`Error adding to cart: ${error.message}`);
        }
    };

    return (
        <Box 
            maxW="sm" 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden" 
            onClick={handleClick}
            cursor="pointer"
            _hover={{ shadow: 'md' }}
        >
            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        {product.Category}
                    </Box>
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    {product.name}
                </Box>

                <Box>Price: ₹{product.price}</Box>
                <Box>Description: {product.Description}</Box>  
                <Box>
                    Seller: {product.SellerID?.firstName || 'Unknown'} {product.SellerID?.lastName || ''}
                </Box>
                <Box>
                    <HStack spacing={2}>
                        <Button 
                            colorScheme="teal" 
                            size="sm" 
                            onClick={handleAddToCart}
                        >
                            Add to cart
                        </Button>
                        {product.SellerID?._id === JSON.parse(localStorage.getItem('user'))?._id && (
                            <Button 
                                colorScheme="red" 
                                size="sm" 
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductCard;