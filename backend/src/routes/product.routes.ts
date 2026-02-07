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

router.post('/', requireRole('ADMIN'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
