import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import productRoutes from './routes/product.route.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import OrderRoutes from './routes/order.route.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});