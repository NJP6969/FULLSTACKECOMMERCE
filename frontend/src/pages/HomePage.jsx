import { Container, SimpleGrid, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import ProductCard from '../components/ProductCard'
import { set } from 'mongoose'

const HomePage = () => {
  const { getProducts, products, setProducts } = useProductStore();

  useEffect(() => {
    getProducts();
  }, []); // Empty dependency array since getProducts is stable
  
const handleRemoveProduct = (productId) => {
  const newProducts = products.filter((product) => product._id !== productId);
  setProducts(newProducts);
};

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} mt={8}>
        <Text fontSize="4xl">Current Products</Text>
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product}  onAddToCart={() => handleRemoveProduct(product._id)} />
            ))
          ) : (
            <Text fontSize="2xl">No products yet</Text>
          )}
        </SimpleGrid>
        <Link to="/create">
          <Text fontSize="2xl">Add New Product</Text>
        </Link>
      </VStack>
    </Container>
  );
};

export default HomePage;