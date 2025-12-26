# 💎 K-PERFUME | Website Kinh Doanh Nước Hoa Chính Hãng

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

> **K-PERFUME** là hệ thống thương mại điện tử chuyên cung cấp các dòng nước hoa cao cấp. Dự án được xây dựng theo kiến trúc MERN Stack (Fullstack), tích hợp thanh toán QR Code và quy trình hoàn tiền tự động.

---

## 📸 Giao diện (Screenshots)

| Trang Chủ (Home Page) | Admin Dashboard |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/e75b5c50-70d3-4288-a8ca-b9fe43ae436f" width="400"> | <img src="https://github.com/user-attachments/assets/3a66222b-7860-404e-8ba4-21183288397f" width="400"> |

| Thanh toán QR (VietQR) | Chi tiết Sản phẩm |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/7c88437e-e579-4ff2-a743-7a07c37bf090" width="400"> | <img src="https://github.com/user-attachments/assets/ddfb3c70-04bd-4230-96f1-2c5caf851464" width="400"> |

---

## ✨ Tính năng nổi bật (Key Features)

### 🛒 Dành cho Khách hàng (Customer)
- 🔹 **Trải nghiệm mua sắm mượt mà:** Giao diện Responsive, tìm kiếm và lọc sản phẩm theo thương hiệu.
- 🔹 **Giỏ hàng thông minh:** Tự động tính toán tổng tiền, lưu trạng thái khi F5.
- 🔹 **Thanh toán hiện đại:** Tự động sinh mã **VietQR** (Số tiền + Nội dung) giúp thanh toán chính xác 100%.
- 🔹 **Hậu mãi:** Gửi yêu cầu **Hoàn tiền (Refund)** trực tiếp trên website đối với đơn hàng đã thanh toán.

### 🛡️ Dành cho Quản trị viên (Admin)
- 🔸 **Dashboard chuyên nghiệp:** Giao diện **Green Mode ** giúp giảm mỏi mắt.
- 🔸 **Quản lý toàn diện:** CRUD Sản phẩm, Quản lý đơn hàng, Quản lý người dùng.
- 🔸 **Xử lý Hoàn tiền:** Tiếp nhận và duyệt yêu cầu hoàn tiền từ khách hàng, lưu trữ thông tin ngân hàng vào Database.

---
## 🚀 Cài đặt & Triển khai (Installation)

Để chạy dự án này trên máy cá nhân (Localhost), vui lòng làm theo các bước sau:

### 1. Clone dự án về máy
```bash
git clone [https://github.com/tdkenemi/k-perfume-ecommerce.git](https://github.com/tdkenemi/k-perfume-ecommerce.git)
```

### 2. Cài đặt thư viện
```bash
# Cài đặt cho Backend
cd backend
npm install

# Quay lại thư mục gốc và cài đặt cho Frontend
cd ../frontend
npm install
```

### 3. Cấu hình biến môi trường (.env)
Tạo một file tên là `.env` nằm trong thư mục **backend** và điền thông tin:
```env
PORT = 5000
MONGO_URI = đường_dẫn_mongodb_của_bạn
JWT_SECRET = mã_bí_mật_của_bạn
```

### 4. Khởi chạy dự án (Run Project)
Bạn cần mở **2 cửa sổ Terminal** riêng biệt để chạy song song:

**Terminal 1 (Chạy Backend):**
```bash
cd backend
npm run server
```
> Server sẽ chạy tại: `http://localhost:5000`

**Terminal 2 (Chạy Frontend):**
```bash
cd frontend
npm start
```
> Website sẽ chạy tại: `http://localhost:3000`

---

## ✨ Tính năng nổi bật

* 🛒 **Mua sắm:** Tìm kiếm, Lọc sản phẩm, Giỏ hàng (Context API).
* 💳 **Thanh toán:** Tích hợp mã **VietQR** tự động điền thông tin chuyển khoản.
* 💰 **Hoàn tiền:** Quy trình gửi yêu cầu hoàn tiền và lưu trữ thông tin ngân hàng.
* 🛡️ **Admin:** Giao diện quản trị chuyên nghiệp quản lý sản phẩm và đơn hàng.

---

## 👨‍💻 Tác giả (Author)

* **Triệu Duy Khang** - *Fullstack Developer*
* **Email:** ktd30907@gmail.com
* **GitHub:** [tdkenemi](https://github.com/tdkenemi)

---
*Dự án thực hiện và viết tiểu luận bởi 1 thành viên - Năm 2025.*
