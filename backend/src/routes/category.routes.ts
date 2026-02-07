import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createCategory,
  getCategories,
} from '../controllers/category.controller';
import { requireRole } from '../middlewares/admin.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', requireRole('ADMIN'), createCategory);
router.get('/', getCategories);

export default router;
