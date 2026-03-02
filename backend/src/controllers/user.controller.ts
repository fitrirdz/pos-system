import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Get all users (for admin filter)
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
      orderBy: {
        username: 'asc',
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch users',
    });
  }
};
