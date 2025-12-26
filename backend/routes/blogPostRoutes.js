import express from 'express';
import {
    getBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} from '../controllers/blogPostController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// === Route Gốc: /api/blog-posts ===
router.route('/')
    .get(getBlogPosts) // Ai cũng xem được
    .post(protect, createBlogPost); // Phải đăng nhập mới được đăng bài

// === Route Chi tiết: /api/blog-posts/:id ===
router.route('/:id')
    .get(getBlogPostById) // Ai cũng xem được
    .put(protect, admin, updateBlogPost) // Chỉ Admin mới được sửa (duyệt bài)
    .delete(protect, admin, deleteBlogPost); // Chỉ Admin mới được xóa

export default router;