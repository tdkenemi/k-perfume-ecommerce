import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// --- HÀM GỬI EMAIL (Helper) ---
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dùng SMTP khác
    auth: {
      user: 'khangtrieugioi@gmail.com', // Thay bằng email thật của bạn
      pass: 'tjfw cotl xhjs ixtn',    // Thay bằng App Password của Gmail
    },
  });

  const message = {
    from: 'K-Perfume Support <support@kperfume.vn>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

// --- CÁC HÀM CŨ GIỮ NGUYÊN ---
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email này đã được sử dụng');
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Thông tin không hợp lệ');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Không thể xóa admin');
    }
    await user.deleteOne();
    res.json({ message: 'Đã xóa người dùng' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// === 1. QUÊN MẬT KHẨU (Gửi mail) ===
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy email này trong hệ thống');
  }

  // Lấy token reset
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Tạo link reset (Frontend URL)
  // Giả sử frontend chạy port 3000
  const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

  const message = `Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.\n\n` +
    `Vui lòng bấm vào link dưới đây để đặt lại mật khẩu:\n\n${resetUrl}\n\n` + 
    `Link này sẽ hết hạn sau 10 phút.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Khôi phục mật khẩu K-Perfume',
      message,
    });

    res.status(200).json({ success: true, data: 'Email đã được gửi!' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Không thể gửi email. Vui lòng thử lại.');
  }
});

// === 2. ĐẶT LẠI MẬT KHẨU (Nhập mật khẩu mới) ===
const resetPassword = asyncHandler(async (req, res) => {
  // Mã hóa token gửi lên để so sánh với token trong DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Kiểm tra còn hạn không
  });

  if (!user) {
    res.status(400);
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }

  // Đặt mật khẩu mới
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, data: 'Mật khẩu đã được cập nhật!' });
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword, // Xuất hàm này
  resetPassword,  // Xuất hàm này
};