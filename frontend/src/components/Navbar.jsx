import React from 'react';
import { Container, Flex, Text, Button } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container maxW="container.xl" bg="gray.700" color="white" py={4} textAlign="center">
      <Flex justifyContent="space-between" alignItems="center" flexDir={{ base: 'column', sm: 'row' }}>
        <Link to="/"> 
          <Text fontSize="2xl" fontWeight="bold">Buy sell rent IIITH</Text>
        </Link>
        <Flex gap={4}>
          {user ? (
            <>
              <Link to="/create">
                <Button colorScheme="teal" variant="solid">ADD</Button>
              </Link>
              <Link to="/profile">
                <Button colorScheme="teal" variant="solid">Profile</Button>
              </Link>
              <Button onClick={handleLogout} colorScheme="red">Logout</Button>
            </>
          ) : (
            <Link to="/login">
              <Button colorScheme="teal">Login</Button>
            </Link>
          )}
          <Link to="/search">
    <Button colorScheme="teal" variant="solid">Search</Button>
</Link>
<Link to="/cart">
    <Button colorScheme="teal" variant="solid">Cart</Button>
</Link>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Navbar;