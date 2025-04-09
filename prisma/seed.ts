import { PrismaClient, Region, ApplicationType, Status, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create system admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@system.local',
      name: 'System Admin',
      role: Role.ADMIN,
    },
  });

  const applications = [
    {
      name: 'Google Workspace',
      description: 'Email, calendar, and collaboration tools for business',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'RingCentral',
      description: 'Cloud-based business communications platform',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Microsoft 365',
      description: 'Productivity and collaboration tools suite',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Basecamp',
      description: 'Project management and team collaboration tool',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Box',
      description: 'Cloud content management and file sharing',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Slack',
      description: 'Business communication and messaging platform',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'KnowBe4',
      description: 'Security awareness training platform',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Microsoft Intune',
      description: 'Cloud-based device management solution',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'BitDefender',
      description: 'Endpoint security and antivirus solution',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'NetSuite',
      description: 'Cloud-based business management suite',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'ProcessMaker',
      description: 'Business process management and workflow automation',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Zendesk',
      description: 'Customer service and engagement platform',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'AWS',
      description: 'Cloud computing and infrastructure services',
      type: ApplicationType.ONBOARDING,
      isRequired: false,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Front',
      description: 'Shared inbox and customer communication platform',
      type: ApplicationType.ONBOARDING,
      isRequired: true,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
    {
      name: 'Shopify',
      description: 'E-commerce and point of sale platform',
      type: ApplicationType.ONBOARDING,
      isRequired: false,
      regions: ['US', 'EU', 'KR', 'CN'],
    },
  ];

  for (const app of applications) {
    await prisma.application.create({
      data: {
        name: app.name,
        description: app.description,
        type: app.type,
        isRequired: app.isRequired,
        regions: app.regions as Region[],
      },
    });
  }

  // Create test employees
  const employees = [
    {
      name: 'John Doe',
      emailPersonal: 'john.doe@example.com',
      emailCompany: 'john.doe@company.com',
      region: Region.US,
      department: 'Engineering',
      position: 'Senior Software Engineer',
      joiningDate: new Date('2024-01-01'),
      status: Status.ACTIVE,
    },
    {
      name: 'Jane Smith',
      emailPersonal: 'jane.smith@example.com',
      emailCompany: 'jane.smith@company.com',
      region: Region.EU,
      department: 'Product',
      position: 'Product Manager',
      joiningDate: new Date('2024-02-15'),
      status: Status.ACTIVE,
    },
    {
      name: 'Kim Lee',
      emailPersonal: 'kim.lee@example.com',
      emailCompany: 'kim.lee@company.com',
      region: Region.KR,
      department: 'Design',
      position: 'UI/UX Designer',
      joiningDate: new Date('2024-03-01'),
      status: Status.ACTIVE,
    },
  ];

  for (const employee of employees) {
    await prisma.employee.create({
      data: employee,
    });
  }

  console.log('Seed completed successfully');
  console.log('Admin user ID:', adminUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 