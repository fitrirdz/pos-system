import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/admin.middleware';
import {
	activateUser,
	changeMyPassword,
	createUser,
	deactivateUser,
	getUsers,
	updateUser,
	updateUserRole,
} from '../controllers/user.controller';

const router = Router();
router.patch('/me/password', authMiddleware, changeMyPassword);
router.get('/', authMiddleware, requireRole(['ADMIN']), getUsers);
router.post('/', authMiddleware, requireRole(['ADMIN']), createUser);
router.patch('/:id', authMiddleware, requireRole(['ADMIN']), updateUser);
router.patch('/:id/deactivate', authMiddleware, requireRole(['ADMIN']), deactivateUser);
router.patch('/:id/activate', authMiddleware, requireRole(['ADMIN']), activateUser);
router.patch('/:id/role', authMiddleware, requireRole(['ADMIN']), updateUserRole);

export default router;
