import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getCart);

router.post(
  '/',
  [
    body('productId').notEmpty(),
    body('quantity').isInt({ min: 1 })
  ],
  addToCart
);

router.put(
  '/:id',
  [body('quantity').isInt({ min: 1 })],
  updateCartItem
);

router.delete('/:id', removeFromCart);

router.delete('/', clearCart);

export default router;
