import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'John Doe',
        emailPersonal: 'john.doe@example.com',
        emailCompany: 'john.doe@company.com',
        region: 'US',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        joiningDate: new Date('2023-01-01'),
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Jane Smith',
        emailPersonal: 'jane.smith@example.com',
        emailCompany: 'jane.smith@company.com',
        region: 'EU',
        department: 'Product',
        position: 'Product Manager',
        joiningDate: new Date('2023-02-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Kim Lee',
        emailPersonal: 'kim.lee@example.com',
        emailCompany: 'kim.lee@company.com',
        region: 'KR',
        department: 'Design',
        position: 'UI/UX Designer',
        joiningDate: new Date('2023-03-20'),
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Wang Wei',
        emailPersonal: 'wang.wei@example.com',
        emailCompany: 'wang.wei@company.com',
        region: 'CN',
        department: 'Marketing',
        position: 'Marketing Manager',
        joiningDate: new Date('2023-04-10'),
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('Seed data created:', employees);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 