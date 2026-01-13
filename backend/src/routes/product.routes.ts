import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { authenticate, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', authenticate, isAdmin, upload.array('images', 5), createProduct);
router.put('/:id', authenticate, isAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;
