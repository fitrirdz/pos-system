import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // hapus admin lama kalau ada
  await prisma.user.deleteMany({
    where: { username: 'admin' },
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
