import React, { useState } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    Input, 
    Button, 
    Text 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                alert('Login Successful');
                navigate('/profile');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('Error logging in');
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={4}>
                <Heading>Login</Heading>
                <Input 
                    type="email" 
                    placeholder="Email (@iiit.ac.in)"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input 
                    type="password" 
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Button colorScheme="teal" onClick={handleSubmit} w="full">
                    Login
                </Button>
                <Text>
                    Don't have an account? <Link to="/register" style={{color: 'teal'}}>Register</Link>
                </Text>
            </VStack>
        </Container>
    );
};

export default Login;