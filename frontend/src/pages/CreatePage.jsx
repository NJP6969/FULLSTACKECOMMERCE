import React from 'react'
import { useState,  } from 'react';
import { Container, VStack, Heading, Input, Textarea, Button } from '@chakra-ui/react';
import { useProductStore } from '../store/product';
import { set } from 'mongoose';

export const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        Description: "",
        Category: "",
        SellerID: ""
    });

    const {createProduct} = useProductStore();  

    const handleSubmit = async () => {
        const res = await createProduct(newProduct);
        console.log(res);
        setNewProduct({name: "", price: 0, Description: "", Category: "", SellerID: ""});
    };

  return <Container maxW="container.xl" bg="gray.700" color="white" py={4} textAlign="center">
    <VStack spacing={4}>
        <Heading>Post a new product</Heading>
        <Input placeholder="Name" name="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}/>
        <Input placeholder="Price" name="price" type='number' value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}/>
        <Input placeholder="Description" name="Description" value={newProduct.Description} onChange={(e) => setNewProduct({ ...newProduct, Description: e.target.value })}/>
        <Input placeholder="Category" name="Category" value={newProduct.Category} onChange={(e) => setNewProduct({ ...newProduct, Category: e.target.value })}/>
        <Input placeholder="Seller ID" name="SellerID" value={newProduct.SellerID} onChange={(e) => setNewProduct({ ...newProduct, SellerID: e.target.value })}/>

        <Button colorScheme="teal" onClick={handleSubmit} w="full">Submit</Button>
    </VStack>
    </Container>
};

export default CreatePage;