import express from 'express';
import dotenv from 'dotenv';
import { connectDB} from "./config/db.js";
import path from 'path';
import productRoutes from './routes/product.route.js';

dotenv.config();
const app = express();
const PORT=process.env.PORT || 5000;
app.use(express.json());
app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port 5000');

    console.log('http://localhost:'+PORT);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/api/products", productRoutes);



