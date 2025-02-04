import express from 'express';
import { registerUser, loginUser, casLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/cas/login', casLogin);
router.get('/cas/callback', casLogin);

export default router;