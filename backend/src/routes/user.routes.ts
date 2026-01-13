import { Router } from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.put('/profile', updateProfile);

router.put(
  '/password',
  [body('newPassword').isLength({ min: 6 })],
  changePassword
);

router.get('/addresses', getAddresses);

router.post(
  '/addresses',
  [
    body('fullName').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('street').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('department').trim().notEmpty()
  ],
  createAddress
);

router.put('/addresses/:id', updateAddress);

router.delete('/addresses/:id', deleteAddress);

export default router;
