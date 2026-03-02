import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/admin.middleware';
import { getUsers } from '../controllers/user.controller';

const router = Router();
router.get('/', authMiddleware, requireRole(['ADMIN']), getUsers);

export default router;
