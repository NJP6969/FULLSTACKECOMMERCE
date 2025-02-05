import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Input, 
    SimpleGrid,
    Select,
    HStack,
    VStack,
    Text 
} from '@chakra-ui/react';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const { getProducts, products } = useProductStore();

    const categories = [
        "Electronics",
        "Books",
        "Furniture",
        "Clothing",
        "Sports Equipment",
        "Lab Equipment",
        "Study Material",
        "Musical Instruments",
        "Stationery",
        "Food",
        "Grocery",
        "Others"
    ];

    useEffect(() => {
        handleSearch(searchTerm, selectedCategory);
    }, [selectedCategory]); // Trigger search when category changes

    const handleSearch = (value, category = selectedCategory) => {
        setSearchTerm(value);
        getProducts(value, category ? [category] : []);
    };

    if (!products) {
        return null;
    }

    return (
        <Container maxW="container.xl" py={4}>
            <VStack spacing={4}>
                <Text fontSize="2xl">Search Products</Text>
                <HStack w="100%" spacing={4}>
                    <Input 
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        flex={1}
                    />
                    <Select 
                        placeholder="Select category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        w="200px"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                </HStack>
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
            </VStack>
        </Container>
    );
};

export default SearchPage;