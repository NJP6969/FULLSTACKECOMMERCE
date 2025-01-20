import { Container, SimpleGrid, VStack } from '@chakra-ui/react'
import React from 'react'
import { Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { use } from 'react'
import { useProductStore } from '../store/product'
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react'
import { get } from 'mongoose'
import { getProducts } from '../../../backend/controllers/product.controller'

const HomePage = () => {
  const { getProducts, products } = useProductStore();

  useEffect(() => {
    getProducts();
  }, []); // Empty dependency array since getProducts is stable

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} mt={8}>
        <Text fontSize="4xl">Current Products</Text>
        <SimpleGrid columns={3} spacing={10}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
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



// const HomePage = () => {
//   const {fetchProducts, products} = useProductStore();
//    useEffect(() => {
//      getProducts();
//    }, [getProducts]);
//    console.log(products);
//    return (
//      <Container maxW="container.lg">
//        <VStack spacing={8} mt={8}>
//          <Text fontSize="4xl">Current Products</Text>
//          <SimpleGrid columns={3} spacing={10}>
//          {products.map((product) => (
//            <ProductCard key={product._id} product={product} />
//          ))}
//          </SimpleGrid>
         
//          <Link to={'/Create'}> <Text fontSize="2xl">No products yet</Text></Link>
        
//        </VStack>
//      </Container>
//    )
//  }

//above code only renders those products which u create