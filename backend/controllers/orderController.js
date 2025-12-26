import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm trong đơn hàng');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // --- KHÔNG GỬI EMAIL Ở ĐÂY (Để đợi xác nhận thanh toán mới gửi) ---
    
    res.status(201).json(createdOrder);
  }
});

// @desc    Lấy đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (!order.user) {
         if (req.user.isAdmin) { res.json(order); return; } 
         else { res.status(404); throw new Error('Người dùng không tồn tại'); }
    }

    if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
    } else {
        res.status(401);
        throw new Error('Không có quyền xem đơn hàng này');
    }
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Cập nhật trạng thái ĐÃ THANH TOÁN (Admin bấm) -> GỬI EMAIL
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();

    // --- GỬI EMAIL XÁC NHẬN ĐƠN HÀNG & THANH TOÁN ---
    try {
        const productRows = order.orderItems.map(item => {
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;"><strong>${item.name}</strong></td>
                    <td style="padding: 10px; text-align: center;">${item.qty}</td>
                    <td style="padding: 10px; text-align: right;">${item.price.toLocaleString('vi-VN')}₫</td>
                </tr>
            `;
        }).join('');

        const mailContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #165c3e; text-align: center; border-bottom: 2px solid #165c3e; padding-bottom: 10px;">XÁC NHẬN THANH TOÁN THÀNH CÔNG</h2>
                
                <p>Xin chào <strong>${order.user.name}</strong>,</p>
                <p>K-Perfume xác nhận đã nhận được khoản thanh toán cho đơn hàng <strong>#${order._id}</strong>.</p>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #bbf7d0;">
                    <p style="margin: 5px 0; color: #166534; font-weight: bold;">✅ TRẠNG THÁI: ĐÃ THANH TOÁN</p>
                    <p style="margin: 5px 0;"><strong>💳 Phương thức:</strong> ${order.paymentMethod}</p>
                    <p style="margin: 5px 0;"><strong>🚚 Địa chỉ giao:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
                </div>

                <h3 style="color: #165c3e;">Chi tiết đơn hàng:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr style="background: #165c3e; color: white;">
                        <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                        <th style="padding: 10px; text-align: center;">SL</th>
                        <th style="padding: 10px; text-align: right;">Giá</th>
                    </tr>
                    ${productRows}
                </table>

                <div style="text-align: right; margin-top: 20px;">
                    <p>Tạm tính: ${order.itemsPrice.toLocaleString('vi-VN')}₫</p>
                    <p>Phí ship: ${order.shippingPrice.toLocaleString('vi-VN')}₫</p>
                    <p>Thuế VAT: ${order.taxPrice.toLocaleString('vi-VN')}₫</p>
                    <h3 style="color: #B91C1C;">Tổng cộng: ${order.totalPrice.toLocaleString('vi-VN')}₫</h3>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">Cảm ơn quý khách đã mua sắm tại K-Perfume!</p>
            </div>
        `;

        await sendEmail({
            email: order.user.email,
            subject: `[K-Perfume] Xác nhận thanh toán - Đơn hàng #${order._id}`,
            message: mailContent
        });
        console.log(`Đã gửi email xác nhận cho ${order.user.email}`);
    } catch (error) {
        console.error("Lỗi gửi email:", error.message);
    }
    // -----------------------------------------------------------

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Cập nhật trạng thái ĐÃ GIAO HÀNG
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Lấy đơn hàng của người dùng đang đăng nhập
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Lấy thống kê Admin
// @route   GET /api/orders/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalUsers = await User.countDocuments({ isAdmin: false });
        
        const totalRevenueResult = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        const dailySales = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$totalPrice' } } },
            { $sort: { _id: 1 } },
        ]);

        const categorySales = await Order.aggregate([
            { $unwind: '$orderItems' },
            { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            { $group: { _id: '$productDetails.category', total: { $sum: '$orderItems.price' } } },
        ]);

        res.json({ totalOrders, totalProducts, totalUsers, totalRevenue, dailySales, categorySales });
    } catch (error) {
        res.status(500);
        throw new Error('Lỗi thống kê: ' + error.message);
    }
});

// @desc    Xóa đơn hàng
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.deleteOne();
    res.json({ message: 'Đơn hàng đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Hủy đơn hàng (Xử lý Hoàn tiền nếu đã thanh toán)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (order.isDelivered) {
            res.status(400);
            throw new Error('Đơn hàng đã giao, không thể hủy');
        }

        // TRƯỜNG HỢP 1: Đã thanh toán -> Lưu thông tin ngân hàng để Admin hoàn tiền
        if (order.isPaid) {
            const { bankName, accountNumber, accountName } = req.body;
            
            // Cập nhật thông tin hoàn tiền vào đơn hàng
            order.refundResult = {
                bankName,
                accountNumber,
                accountName,
                refundAt: Date.now(),
                isRefunded: false
            };
            
            await order.save();
            res.json({ message: 'Yêu cầu hoàn tiền đã được gửi tới Admin' });
        } 
        // TRƯỜNG HỢP 2: Chưa thanh toán -> Xóa luôn
        else {
            await order.deleteOne();
            res.json({ message: 'Đơn hàng đã hủy thành công' });
        }
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

// @desc    Lấy danh sách đơn cần hoàn tiền (Admin)
// @route   GET /api/orders/refunds
// @access  Private/Admin
const getRefundOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ 
        'refundResult.refundAt': { $exists: true }, // Có ngày yêu cầu hoàn tiền
        'refundResult.isRefunded': false // Chưa được hoàn tiền
    }).populate('user', 'id name email');
    
    res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getAdminStats,
  deleteOrder,
  cancelOrder,     // <--- Đã cập nhật logic hủy
  getRefundOrders, // <--- Hàm mới cho Admin
};