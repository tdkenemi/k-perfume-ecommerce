import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Import thư viện crypto

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    
    // === THÊM 2 TRƯỜNG MỚI CHO QUÊN MẬT KHẨU ===
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// === HÀM TẠO TOKEN KHÔI PHỤC MẬT KHẨU ===
userSchema.methods.getResetPasswordToken = function () {
  // Tạo chuỗi ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Mã hóa token và lưu vào database (để bảo mật)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token có hiệu lực trong 10 phút
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // Trả về token chưa mã hóa để gửi qua email
};

const User = mongoose.model('User', userSchema);
export default User;