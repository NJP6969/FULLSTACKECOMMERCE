// backend/controllers/auth.controller.js
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import CAS from 'cas';

const cas = new CAS({
    base_url: 'https://login.iiit.ac.in/cas',
    service: 'http://localhost:5000/api/auth/cas/callback',
    version: 2.0,
    securityOptions: {
        rejectUnauthorized: false // Only for development
    }
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Verify reCAPTCHA
const verifyCaptcha = async (token) => {
    try {
        console.log('Verifying captcha token:', token);
        console.log('Using secret key:', process.env.RECAPTCHA_SECRET_KEY);
        
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: token
                }
            }
        );
        
        console.log('Captcha verification response:', response.data);
        return response.data.success;
    } catch (error) {
        console.error('Captcha verification error:', error);
        return false;
    }
};
export const casLogin = async (req, res) => {
    try {
        if (!req.query.ticket) {
            // Construct the login URL manually
            const serviceUrl = 'http://localhost:5000/api/auth/cas/callback';
            const casLoginUrl = 'https://login.iiit.ac.in/cas/login';
            const loginUrl = `${casLoginUrl}?service=${encodeURIComponent(serviceUrl)}`;
            return res.redirect(loginUrl);
        }

        // Validate ticket
        const ticket = req.query.ticket;
        cas.validate(ticket, async (err, status, username, extended) => {
            if (err || !status) {
                return res.status(401).json({
                    success: false,
                    message: 'CAS Authentication failed'
                });
            }

            try {
                // Get email from CAS response
                const email = extended.attributes['e-mail'][0];
                
                // Find or create user
                let user = await User.findOne({ email });
                if (!user) {
                    const name = username.split(' ');
                    user = await User.create({
                        firstName: name[0] || username,
                        lastName: name[1] || '',
                        email: email,
                        age: 0,
                        contactNumber: '',
                        password: Math.random().toString(36)
                    });
                }

                // Generate token and redirect
                const token = generateToken(user._id);
                res.redirect(`http://localhost:5173/login?token=${token}`);
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        // Verify captcha
        const isValidCaptcha = await verifyCaptcha(captchaToken);
        if (!isValidCaptcha) {
            return res.status(400).json({
                success: false,
                message: 'Invalid captcha verification'
            });
        }

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    contactNumber: user.contactNumber,
                    token: generateToken(user._id),
                },
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, age, contactNumber, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    contactNumber: user.contactNumber,
                    token: generateToken(user._id),
                },
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};