import { Box, HStack, Button } from '@chakra-ui/react';
import { useProductStore } from '../store/product';

const ProductCard = ({ product }) => {
    const { deleteProduct } = useProductStore();

    const handleDelete = async () => {
        const result = await deleteProduct(product._id);
        if (result && result.success) {
            console.log('Product deleted successfully');
        }
    };
    return (
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
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

                <Box>
                    {product.price}
                </Box>
                <Box>
                    {product.Description}
                </Box>  
                <Box>
                    {product.SellerID}
                </Box>
                <Box>
                    <HStack spacing={2}>
                        <Button colorScheme="teal" size="sm">
                            Add to cart?
                        </Button>
                        <Button colorScheme="red" size="sm" onClick={() =>handleDelete(product._id)}>

                            Delete
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductCard;