import express from 'express';

import { createProduct, deleteProduct, updateProduct, getProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);

router.delete("/:id", deleteProduct);

router.post('/', createProduct);

//console.log(process.env.MONGO_URI);

router.put("/:id", updateProduct);

export default router;
