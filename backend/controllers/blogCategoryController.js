// backend/controllers/blogCategoryController.js
import asyncHandler from 'express-async-handler';
import BlogCategory from '../models/blogCategoryModel.js';

// @desc    Lấy tất cả danh mục blog
// @route   GET /api/blog-categories
const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find({});
  res.json(categories);
});

// @desc    Tạo một danh mục blog mới
// @route   POST /api/blog-categories
const createBlogCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Tên danh mục là bắt buộc');
  }

  const categoryExists = await BlogCategory.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Danh mục này đã tồn tại');
  }

  const category = new BlogCategory({
    name: name,
    user: req.user._id,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Xóa một danh mục blog
// @route   DELETE /api/blog-categories/:id
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: 'Danh mục đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy danh mục');
  }
});

// QUAN TRỌNG: Phải dùng export { ... }
export { 
  getBlogCategories, 
  createBlogCategory, 
  deleteBlogCategory 
};