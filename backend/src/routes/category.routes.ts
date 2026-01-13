import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', authenticate, isAdmin, upload.single('image'), createCategory);
router.put('/:id', authenticate, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

export default router;
