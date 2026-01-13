import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username & password required' });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
};
