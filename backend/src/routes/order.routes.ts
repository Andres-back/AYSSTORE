import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/order.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post(
  '/',
  [
    body('addressId').notEmpty(),
    body('paymentMethod').notEmpty()
  ],
  createOrder
);

router.get('/', getOrders);

router.get('/:id', getOrderById);

// Admin routes
router.put('/:id/status', isAdmin, updateOrderStatus);

router.put('/:id/payment', isAdmin, updatePaymentStatus);

export default router;
