// backend/data/users.js
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10), // Mã hóa mật khẩu
    isAdmin: true,
  },
  {
    name: 'User Test',
    email: 'user@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

module.exports = users;