import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {getProductById} from '../controllers/product.controller.js';

import { createProduct, deleteProduct, updateProduct, getProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/:id', getProductById);
router.get('/', getProducts);
router.post('/', protect, createProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);

export default router;
