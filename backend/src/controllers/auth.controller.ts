import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { signToken } from '../utils/jwt';

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Username or password is incorrect',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Username or password is incorrect',
      });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // ✅ Simpan token di httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ganti true kalau production HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    });

    return res.json({
      message: 'Login success',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
}

export function me(req: any, res: Response) {
  return res.json({
    user: req.user,
  });
}
