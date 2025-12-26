import express from 'express';
import {
  getBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
} from '../controllers/blogCategoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogCategories)
  .post(protect, admin, createBlogCategory);

router.route('/:id')
  .delete(protect, admin, deleteBlogCategory);

// QUAN TRỌNG NHẤT: Dòng này sửa lỗi "does not provide an export named 'default'"
export default router;