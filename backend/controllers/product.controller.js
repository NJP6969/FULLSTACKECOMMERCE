import Product from '../model/product.model.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid product id' });
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' });
    }
};

export const createProduct = async (req, res) => {
    const { name, price, Description, Category, SellerID } = req.body;
    if (!name || !price || !Description || !Category || !SellerID) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const newProduct = new Product({ name, price, Description, Category, SellerID });
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, Description, Category, SellerID } = req.body;

    // Log the id and request body
    console.log(`Updating product with ID: ${id}`);
    console.log(`Request body:`, req.body);
    try {
        const products = await Product.find({}, '_id');
        console.log('All product IDs in the database:', products);
    } catch (error) {
        console.log('Error fetching product IDs:', error);
    }

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid product id' });
    }

    if (!name || !price || !Description || !Category || !SellerID) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, Description, Category, SellerID },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}; //update doesnt work lmao

export const getProductIds = async (req, res) => {
    try {
        const products = await Product.find({}, '_id'); // Only select the _id field
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};