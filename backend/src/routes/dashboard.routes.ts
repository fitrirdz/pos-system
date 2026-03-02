import { Router } from 'express';
import {
  getDashboardStats,
  getMonthlySales,
  getSevenDaySales,
  getTopSellingProducts,
} from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, getDashboardStats);
router.get('/monthly-sales', authMiddleware, getMonthlySales);
router.get('/seven-day-sales', authMiddleware, getSevenDaySales);
router.get('/top-products', authMiddleware, getTopSellingProducts);

export default router;
