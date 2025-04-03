import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmployeeForm } from '../_components/employee-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Region } from '@prisma/client';

export const metadata: Metadata = {
  title: 'New Employee',
  description: 'Create a new employee',
};

export default async function NewEmployeePage() {
  const applications = await prisma.application.findMany({
    orderBy: { name: 'asc' },
  });

  async function createEmployee(data: FormData) {
    'use server';

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    // Get or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || 'Unknown',
      },
    });

    const name = data.get('name') as string;
    const emailPersonal = data.get('emailPersonal') as string;
    const emailCompany = data.get('emailCompany') as string;
    const region = data.get('region') as Region;
    const department = data.get('department') as string;
    const position = data.get('position') as string;
    const joiningDate = data.get('joiningDate') as string;
    const applicationIds = data.getAll('applications') as string[];

    // First create the employee
    const employee = await prisma.employee.create({
      data: {
        name,
        emailPersonal,
        emailCompany,
        region,
        department,
        position,
        joiningDate: new Date(joiningDate),
        status: 'ACTIVE',
      },
    });

    // Then create the employee applications
    if (applicationIds.length > 0) {
      await prisma.employeeApplication.createMany({
        data: applicationIds.map((applicationId) => ({
          employeeId: employee.id,
          applicationId,
          status: 'REQUESTED',
          requestedById: user.id,
        })),
      });
    }

    redirect(`/employees/${employee.id}`);
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Employee</h1>
        <Button variant="outline" asChild>
          <Link href="/employees">Back to List</Link>
        </Button>
      </div>

      <div className="mt-6">
        <EmployeeForm applications={applications} action={createEmployee} />
      </div>
    </div>
  );
} 