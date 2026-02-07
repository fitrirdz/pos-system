import { Response, NextFunction } from 'express';

export function requireRole(role: 'ADMIN') {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
