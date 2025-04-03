import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 