import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createOrder, getMyOrders, completeOrder, getDeliveryOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/deliver-orders', protect, getDeliveryOrders);
router.put('/:id/complete', protect, completeOrder);

export default router;