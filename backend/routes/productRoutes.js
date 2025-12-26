import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBrands, // Nhớ import hàm này
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Route gốc (Lấy DS & Tạo SP)
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct); // <-- Cần có protect để lấy được User ID (Sửa lỗi Validation Error)

// 2. Route lấy danh sách Thương hiệu (PHẢI ĐẶT TRƯỚC ROUTE /:id)
router.get('/brands', getProductBrands);

// 3. Route lấy danh sách Danh mục (Nếu có)
// router.get('/categories', getProductCategories); 

// 4. Route chi tiết theo ID (Lấy 1 SP, Sửa, Xóa)
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;