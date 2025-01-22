import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    otp: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Hash OTP before saving
orderSchema.pre('save', async function(next) {
    if (!this.isModified('otp')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;