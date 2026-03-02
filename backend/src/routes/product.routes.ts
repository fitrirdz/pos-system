import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product.controller';
import { requireRole } from '../middlewares/admin.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', authMiddleware, requireRole(['ADMIN']), createProduct);
router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id', authMiddleware, requireRole(['ADMIN']), updateProduct);
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), deleteProduct);

export default router;
