import Order from '../model/order.model.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const createOrder = async (req, res) => {
    try {
        const { productId, sellerId, amount } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        
        // Hash the OTP before saving
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const order = await Order.create({
            transactionId: uuidv4(),
            buyerId: req.user._id,
            sellerId,
            productId,
            amount,
            otp: hashedOtp
        });

        res.status(201).json({ 
            success: true, 
            data: { 
                _id: order._id,
                transactionId: order.transactionId,
                buyerId: order.buyerId,
                sellerId: order.sellerId,
                productId: order.productId,
                amount: order.amount,
                status: order.status,
                otp // Send the unhashed OTP
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDeliveryOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            sellerId: req.user._id,
            status: 'pending'
        })
        .populate('productId')
        .populate('buyerId', 'firstName lastName');

        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { otp } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Order is not pending' });
        }

        const isMatch = await bcrypt.compare(otp, order.otp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        order.status = 'completed';
        await order.save();

        res.json({ success: true, message: 'Order completed successfully' });
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