import User from '../model/user.model.js';
import Product from '../model/product.model.js';
import Order from '../model/order.model.js';


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.contactNumber = req.body.contactNumber || user.contactNumber;
        user.age = req.body.age || user.age;

        const updatedUser = await user.save();
        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber,
                age: updatedUser.age
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if user is trying to add their own product
        if (product.SellerID.toString() === req.user._id.toString()) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot add your own product to cart' 
            });
        }
                
        
        // Check if product already in cart
        if (user.cart.includes(productId)) {
            return res.status(400).json({ success: false, message: 'Product already in cart' });
        }

        user.cart.push(productId);
        await user.save();

        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getCart = async (req, res) => {
    try {
        // Get user's cart with populated products and sellers
        const user = await User.findById(req.user._id)
            .populate({
                path: 'cart',
                populate: {
                    path: 'SellerID',
                    model: 'User',
                    select: '_id firstName lastName'
                }
            });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get all completed orders
        const completedOrders = await Order.find({
            status: { $in: ['pending', 'completed'] }
        });

        // Filter out products that are in completed orders
        const availableCartItems = user.cart.filter(item => {
            const isOrdered = completedOrders.some(order => 
                order.productId.toString() === item._id.toString()
            );
            return !isOrdered;
        });

        res.json({ success: true, data: availableCartItems });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.cart = user.cart.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};