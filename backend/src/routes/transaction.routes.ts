import { Router } from 'express';
import {
  createTransaction,
  getTransactionById,
  getTransactions,
} from '../controllers/transaction.controller';
import { requireRole } from '../middlewares/admin.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, requireRole(['ADMIN', 'CASHIER']), createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/:id', authMiddleware, getTransactionById);

export default router;
