import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { updateProfile, getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

export default router;