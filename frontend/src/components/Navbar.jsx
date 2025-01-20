import React from 'react';
import { Container, Flex, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Container maxW="container.xl" bg="gray.700" color="white" py={4} textAlign="center">
      <Flex justifyContent="space-between" alignItems="center" flexDir={{ base: 'column', sm: 'row' }}>
      <Link to={"/"}> 
        <Text
          fontSize="2xl"
          fontWeight="bold"
          position="relative"
          zIndex={1}
          _before={{
            content: '"Buy sell rent IIITH"',
            position: "absolute",
            top: 0,
            left: 0,
            background: "linear-gradient(to left, #7928CA, #FF0080)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            zIndex: 2
          }}
        >
         Buy sell rent IIITH
        </Text>
        </Link>
        <Link to ="/create">
        <Button ml="auto" colorScheme="teal" variant="solid">
          ADD
        </Button>
        </Link>
      </Flex>
    </Container>
  );
};

export default Navbar;