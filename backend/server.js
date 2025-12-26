// backend/server.js
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url'; // Cần thiết cho ES Module

import connectDB from './config/db.js';

// Import Routes (CHÚ Ý: Phải có đuôi .js phía sau)
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import blogCategoryRoutes from './routes/blogCategoryRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/blog-posts', blogPostRoutes);
app.use('/api/upload', uploadRoutes);

// --- CẤU HÌNH THƯ MỤC UPLOADS (QUAN TRỌNG) ---
// Định nghĩa __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Giả định thư mục 'uploads' nằm ngay trong thư mục 'backend'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Nếu thư mục 'uploads' nằm ở ngoài (cùng cấp với backend), hãy dùng dòng dưới:
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});