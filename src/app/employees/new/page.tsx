import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmployeeForm } from '../_components/employee-form';

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

    const name = data.get('name') as string;
    const emailPersonal = data.get('emailPersonal') as string;
    const emailCompany = data.get('emailCompany') as string;
    const region = data.get('region') as string;
    const department = data.get('department') as string;
    const position = data.get('position') as string;
    const joiningDate = data.get('joiningDate') as string;
    const applicationIds = data.getAll('applications') as string[];

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
        applications: {
          create: applicationIds.map((applicationId) => ({
            applicationId,
            status: 'REQUESTED',
          })),
        },
      },
    });

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