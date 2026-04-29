import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/admin.middleware';
import {
	createUser,
	deactivateUser,
	getUsers,
	updateUser,
	updateUserRole,
} from '../controllers/user.controller';

const router = Router();
router.get('/', authMiddleware, requireRole(['ADMIN']), getUsers);
router.post('/', authMiddleware, requireRole(['ADMIN']), createUser);
router.patch('/:id', authMiddleware, requireRole(['ADMIN']), updateUser);
router.patch('/:id/deactivate', authMiddleware, requireRole(['ADMIN']), deactivateUser);
router.patch('/:id/role', authMiddleware, requireRole(['ADMIN']), updateUserRole);

export default router;
