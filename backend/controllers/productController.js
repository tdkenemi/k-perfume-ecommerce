import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Lấy tất cả sản phẩm (Có lọc theo Tên, Danh mục, Hãng, Giá, Sắp xếp)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  
   const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },  // Tìm trong Tên
          { brand: { $regex: req.query.keyword, $options: 'i' } }, // Tìm trong Hãng
        ],
      }
    : {};
  // -----------------------------------------------
  const category = req.query.category ? { category: req.query.category } : {};

  let brand = {};
  if (req.query.brand) {
    const brands = req.query.brand.split(','); 
    brand = { brand: { $in: brands } };
  }

  let priceFilter = {};
  if (req.query.minPrice || req.query.maxPrice) {
    priceFilter = { price: {} };
    if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
  }

  let sortOrder = { createdAt: -1 };
  if (req.query.sort) {
    if (req.query.sort === 'low-high') sortOrder = { price: 1 };
    else if (req.query.sort === 'high-low') sortOrder = { price: -1 };
  }

  const products = await Product.find({ 
      ...keyword, ...category, ...brand, ...priceFilter 
  }).sort(sortOrder);

  res.json(products);
});

// @desc    Lấy 1 sản phẩm theo ID
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Lấy danh sách các danh mục
// @route   GET /api/products/categories
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc    Lấy danh sách các thương hiệu
// @route   GET /api/products/brands
const getProductBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands);
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Sản phẩm đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Tạo sản phẩm mẫu
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sản phẩm mẫu',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    images: [],
    brand: 'Hãng mẫu',
    category: 'Nam',
    countInStock: 0,
    numReviews: 0,
    description: 'Mô tả ngắn...',
    detailedDescription: 'Nội dung chi tiết...',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    detailedDescription,
    image,
    images,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.detailedDescription = detailedDescription;
    product.image = image;
    product.images = images || [];
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // --- SỬA LỖI VALIDATION USER TẠI ĐÂY ---
    // Nếu sản phẩm bị thiếu người tạo, gán luôn người đang sửa (Admin) làm chủ sở hữu
    if (!product.user) {
        product.user = req.user._id; 
    }
    // ---------------------------------------

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

export {
  getProducts,
  getProductById,
  getProductCategories,
  getProductBrands,
  deleteProduct,
  createProduct,
  updateProduct,
};