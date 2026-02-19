import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany();

  // Create default users
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      username: 'cashier',
      password: 'cashier123',
      role: UserRole.CASHIER,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
        role: user.role,
      },
    });
    console.log(`✅ Created ${user.role.toLowerCase()}: ${user.username}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
