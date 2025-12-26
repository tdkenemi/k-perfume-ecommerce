// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users.js');
const products = require('./data/products.js');
const User = require('./models/userModel.js');
const Product = require('./models/productModel.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

// Hàm nhập dữ liệu
const importData = async () => {
  try {
    // Xóa sạch dữ liệu cũ
    await Product.deleteMany();
    await User.deleteMany();

    // Thêm user mẫu
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // Lấy user admin (người đầu tiên)

    // Thêm trường 'user' (ID của admin) vào mỗi sản phẩm
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Thêm sản phẩm mẫu
    await Product.insertMany(sampleProducts);

    console.log('Dữ liệu đã được nhập!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`);
    process.exit(1);
  }
};

// Hàm xóa dữ liệu
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Dữ liệu đã được xóa!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`);
    process.exit(1);
  }
};

// Logic để chạy: 'node seeder.js -d' thì xóa, 'node seeder.js' thì nhập
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}