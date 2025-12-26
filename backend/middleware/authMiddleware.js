import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Lấy token từ header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 2. Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Tìm user trong DB và gán vào req.user
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Kiểm tra chắc chắn User còn tồn tại
      if (!req.user) {
         res.status(401);
         throw new Error('Token hợp lệ nhưng tài khoản không còn tồn tại');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Không được phép, token thất bại');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Không được phép, không có token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Không được phép, không phải Admin');
  }
};

export { protect, admin };