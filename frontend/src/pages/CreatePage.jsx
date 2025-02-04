import React from 'react';
import { useState } from 'react';
import { Container, VStack, Heading, Input, Button } from '@chakra-ui/react';
import { useProductStore } from '../store/product';

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        Description: "",
        Category: ""
    });

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

    const { createProduct } = useProductStore();  

    const handleSubmit = async () => {
        const res = await createProduct(newProduct);
        if (res && res.success) {
            setNewProduct({
                name: "", 
                price: 0, 
                Description: "", 
                Category: ""
            });
            alert('Product created successfully');
        }
    };

    return (
        <Container maxW="container.xl" bg="gray.700" color="white" py={4} textAlign="center">
            <VStack spacing={4}>
                <Heading>Post a new product</Heading>
                <Input 
                    placeholder="Name" 
                    name="name" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input 
                    placeholder="Price" 
                    name="price" 
                    type='number' 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Input 
                    placeholder="Description" 
                    name="Description" 
                    value={newProduct.Description} 
                    onChange={(e) => setNewProduct({ ...newProduct, Description: e.target.value })}
                />
                <select 
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '1px solid white'
                    }}
                    value={newProduct.Category}
                    onChange={(e) => setNewProduct({ ...newProduct, Category: e.target.value })}
                >
                    <option value="" disabled>Select category</option>
                    {categories.map((category) => (
                        <option 
                            key={category} 
                            value={category}
                            style={{
                                backgroundColor: '#2D3748',
                                color: 'white'
                            }}
                        >
                            {category}
                        </option>
                    ))}
                </select>
                <Button colorScheme="teal" onClick={handleSubmit} w="full">Submit</Button>
            </VStack>
        </Container>
    );
};

export default CreatePage;