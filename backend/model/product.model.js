import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        default: 0
    },
    Description: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    SellerID: {
        type: String,
        required: true
    },
},
{
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

export default Product;