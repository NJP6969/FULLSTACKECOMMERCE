import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
    updateProfile, 
    getProfile, 
    addToCart,
    getCart,
    removeFromCart
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.route('/cart')
    .get(protect, getCart)
    .post(protect, addToCart);
    
router.delete('/cart/:productId', protect, removeFromCart);

export default router;