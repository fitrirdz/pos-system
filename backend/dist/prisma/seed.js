"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Clear existing users
    await prisma.user.deleteMany();
    // Create default users
    const users = [
        {
            username: 'admin',
            password: 'admin123',
            role: client_1.UserRole.ADMIN,
        },
        {
            username: 'cashier',
            password: 'cashier123',
            role: client_1.UserRole.CASHIER,
        },
    ];
    for (const user of users) {
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
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
