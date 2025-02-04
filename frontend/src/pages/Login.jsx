import React, { useState } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    Input, 
    Button, 
    Text,
    Box 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

// Use VITE_ prefix for environment variables in Vite
const RECAPTCHA_SITE_KEY = "6Le_G80qAAAAAIY6hY-CNau3gqV_dRmNfIVwsjlF";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    const handleCaptchaChange = (value) => {
        setCaptchaToken(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            alert('Please complete the captcha');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken
                }),
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
                <Box>
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                    />
                </Box>
                <Button 
                    colorScheme="teal" 
                    onClick={handleSubmit} 
                    w="full"
                    isDisabled={!captchaToken}
                >
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