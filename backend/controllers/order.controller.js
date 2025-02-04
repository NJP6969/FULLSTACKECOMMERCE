import Order from '../model/order.model.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const createOrder = async (req, res) => {
    try {
        const { productId, sellerId, amount } = req.body;
        
        // Validate required fields
        if (!productId || !sellerId || !amount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP: ${otp}`);
        // Create unique transaction ID
        const transactionId = uuidv4();

        const order = await Order.create({
            transactionId,
            buyerId: req.user._id,
            sellerId,
            productId,
            amount: parseFloat(amount),
            otp
        });

        // Send response with unhashed OTP
        res.status(201).json({ 
            success: true, 
            data: { 
                ...order.toObject(),
                otp // Include unhashed OTP in response
            } 
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating order'
        });
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
        
        // Include OTP for seller to verify
        const ordersWithOtp = orders.map(order => {
            const orderObj = order.toObject();
            // Here seller should see the OTP
            return orderObj;
        });

        res.json({ success: true, data: ordersWithOtp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const completeOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;
        
        const order = await Order.findById(id);
        
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

        // Transform orders to show OTP only to buyers
        const transformOrder = (order) => {
            const orderObj = order.toObject();
            // Only include unhashed OTP if current user is the buyer AND order is pending
            if (orderObj.buyerId._id.toString() === req.user._id.toString() && 
                orderObj.status === 'pending') {
                orderObj.otp = order.otp; // Include unhashed OTP
            } else {
                delete orderObj.otp; // Remove OTP for non-buyers
            }
            return orderObj;
        };

        const pendingOrders = orders
            .filter(order => order.status === 'pending')
            .map(transformOrder);
            
        const boughtItems = orders
            .filter(order => 
                order.buyerId._id.toString() === req.user._id.toString() && 
                order.status === 'completed'
            )
            .map(transformOrder);
            
        const soldItems = orders
            .filter(order => 
                order.sellerId._id.toString() === req.user._id.toString() && 
                order.status === 'completed'
            )
            .map(transformOrder);

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