import React, { useState, useEffect } from 'react';
import { Box, Container, Input, SimpleGrid } from '@chakra-ui/react';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { getProducts, products } = useProductStore();

    useEffect(() => {
        getProducts();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);
        getProducts(value);
    };

    if (!products) {
        return null;
    }

    return (
        <Container maxW="container.xl" py={4}>
            <Box mb={4}>
                <Input 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </Box>
            <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={4}
            >
                {Array.isArray(products) && products.map(product => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                    />
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default SearchPage;