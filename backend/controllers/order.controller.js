import Order from '../model/order.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req, res) => {
    try {
        const { productId, sellerId, amount } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        
        const order = await Order.create({
            transactionId: uuidv4(),
            buyerId: req.user._id,
            sellerId,
            productId,
            amount,
            otp
        });

        res.status(201).json({ 
            success: true, 
            data: { 
                ...order._doc, 
                otp // Send unencrypted OTP in response
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { buyerId: req.user._id },
                { sellerId: req.user._id }
            ]
        })
        .populate('productId')
        .populate('buyerId', 'firstName lastName')
        .populate('sellerId', 'firstName lastName');

        const pendingOrders = orders.filter(order => order.status === 'pending');
        const boughtItems = orders.filter(order => 
            order.buyerId._id.toString() === req.user._id.toString() && 
            order.status === 'completed'
        );
        const soldItems = orders.filter(order => 
            order.sellerId._id.toString() === req.user._id.toString() && 
            order.status === 'completed'
        );

        res.json({
            success: true,
            data: {
                pendingOrders,
                boughtItems,
                soldItems
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};