import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAdminStats,
  deleteOrder, // <--- 1. Đã import hàm xóa
  cancelOrder,
  getRefundOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, admin, getAdminStats);
router.route('/refunds').get(protect, admin, getRefundOrders);
// --- 2. Đã thêm phương thức delete tại đây ---
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder); 
// -----------------------------------------

router.route('/:id/pay').put(protect, admin, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, cancelOrder);
export default router;