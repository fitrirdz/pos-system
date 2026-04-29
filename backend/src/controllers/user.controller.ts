import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

const VALID_ROLES = ['ADMIN', 'CASHIER'] as const;

function isValidRole(role: unknown): role is (typeof VALID_ROLES)[number] {
  return typeof role === 'string' && VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]);
}

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
        isActive: true,
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body as {
      username?: string;
      password?: string;
      role?: string;
    };

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    if (role && !isValidRole(role)) {
      return res.status(400).json({
        message: 'Invalid role',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nextRole: 'ADMIN' | 'CASHIER' = role && isValidRole(role) ? role : 'CASHIER';

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        role: nextRole,
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Username already exists' });
    }

    return res.status(500).json({
      message: 'Failed to create user',
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id ?? '');
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username && !password) {
      return res.status(400).json({
        message: 'At least one field is required',
      });
    }

    const data: { username?: string; password?: string } = {};

    if (username) {
      data.username = username.trim();
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Username already exists' });
    }

    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(500).json({
      message: 'Failed to update user',
    });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id ?? '');

    if ((req as any).user?.userId === id) {
      return res.status(400).json({
        message: 'You cannot deactivate your own account',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(500).json({
      message: 'Failed to deactivate user',
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id ?? '');
    const { role } = req.body as { role?: string };

    if (!role || !isValidRole(role)) {
      return res.status(400).json({
        message: 'Invalid role',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(500).json({
      message: 'Failed to update user role',
    });
  }
};
