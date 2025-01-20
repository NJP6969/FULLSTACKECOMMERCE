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

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        contactNumber: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                alert('Registration Successful');
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={4}>
                <Heading>Register</Heading>
                <Input 
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <Input 
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
                <Input 
                    type="email" 
                    placeholder="Email (@iiit.ac.in)"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input 
                    type="number" 
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
                <Input 
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                />
                <Input 
                    type="password" 
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Button colorScheme="teal" onClick={handleSubmit} w="full">
                    Register
                </Button>
                <Text>
                    Already have an account? <Link to="/login" style={{color: 'teal'}}>Login</Link>
                </Text>
            </VStack>
        </Container>
    );
};

export default Register;