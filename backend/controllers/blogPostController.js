import asyncHandler from 'express-async-handler';
import BlogPost from '../models/blogPostModel.js';
import mongoose from 'mongoose'; // Import thêm mongoose để kiểm tra ID

// Hàm hỗ trợ tạo Slug từ Tiêu đề (Tiếng Việt -> Không dấu)
const createSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang
};

// @desc    Lấy tất cả bài viết
// @route   GET /api/blog-posts
const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 }); 
  res.json(posts);
});

// @desc    Lấy 1 bài viết (Hỗ trợ tìm theo cả ID và Slug)
// @route   GET /api/blog-posts/:id
const getBlogPostById = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  let post;

  // Kiểm tra: Nếu là ObjectId hợp lệ thì tìm theo ID, ngược lại tìm theo Slug
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    post = await BlogPost.findById(idOrSlug).populate('user', 'name');
  } else {
    post = await BlogPost.findOne({ slug: idOrSlug }).populate('user', 'name');
  }

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Tạo bài viết mới
// @route   POST /api/blog-posts
const createBlogPost = asyncHandler(async (req, res) => {
  const title = 'Tiêu đề bài viết mới';
  
  const post = new BlogPost({
    title: title,
    slug: createSlug(title) + '-' + Date.now(), // Tạo slug mặc định tránh trùng
    image: '/images/sample.jpg',
    content: 'Nội dung bài viết...',
    user: req.user._id,
    category: 'Kiến thức', 
    isApproved: false
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Cập nhật bài viết
// @route   PUT /api/blog-posts/:id
const updateBlogPost = asyncHandler(async (req, res) => {
  const { title, image, content, category, isApproved } = req.body;
  const post = await BlogPost.findById(req.params.id);

  if (post) {
    post.title = title || post.title;
    
    // Nếu có sửa tiêu đề thì cập nhật luôn Slug
    if (title) {
        post.slug = createSlug(title);
    }

    post.image = image || post.image;
    post.content = content || post.content;
    post.category = category || post.category;
    post.isApproved = isApproved !== undefined ? isApproved : post.isApproved;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Xóa bài viết
// @route   DELETE /api/blog-posts/:id
const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (post) {
    await post.deleteOne();
    res.json({ message: 'Đã xóa bài viết' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

export {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};