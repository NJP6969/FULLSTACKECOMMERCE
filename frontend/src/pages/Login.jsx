import React, { useState, useEffect } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    Input, 
    Button, 
    Text,
    Box,
    Divider
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
        // Add useEffect to handle CAS callback
        useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            
            if (token) {
                // Token exists in URL, complete login
                localStorage.setItem('token', token);
                
                // Fetch user data using the token
                fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('user', JSON.stringify(data.data));
                        navigate('/profile');
                    }
                })
                .catch(err => {
                    console.error('Error fetching user data:', err);
                    // Clear invalid token
                    localStorage.removeItem('token');
                });
            }
        }, [navigate]);
    const handleCASLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/cas/login';
    };
    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={4}>
                <Heading>Login</Heading>
                
                <Button 
                    colorScheme="blue" 
                    onClick={handleCASLogin} 
                    w="full"
                >
                    Login with IIIT Account (CAS)
                </Button>

                <Divider />
                <Text>Or login with email/password</Text>

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
                    Login with Password
                </Button>
                <Text>
                    Don't have an account? <Link to="/register" style={{color: 'teal'}}>Register</Link>
                </Text>
            </VStack>
        </Container>
    );
};
export default Login;