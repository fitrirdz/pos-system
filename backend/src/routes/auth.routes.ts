import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, me);
router.post('/login', login);
router.post('/logout', logout);

export default router;
