import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmployeeForm } from '../../_components/employee-form';

interface EmployeeEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EmployeeEditPageProps): Promise<Metadata> {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
  });

  if (!employee) {
    return {
      title: 'Employee Not Found',
    };
  }

  return {
    title: `Edit ${employee.name}`,
    description: `Edit employee information for ${employee.name}`,
  };
}

async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      applications: true,
    },
  });

  if (!employee) {
    notFound();
  }

  return employee;
}

export default async function EmployeeEditPage({
  params,
}: EmployeeEditPageProps) {
  const employee = await getEmployee(params.id);
  const applications = await prisma.application.findMany({
    orderBy: { name: 'asc' },
  });

  async function updateEmployee(data: FormData) {
    'use server';

    const name = data.get('name') as string;
    const emailPersonal = data.get('emailPersonal') as string;
    const emailCompany = data.get('emailCompany') as string;
    const region = data.get('region') as string;
    const department = data.get('department') as string;
    const position = data.get('position') as string;
    const joiningDate = data.get('joiningDate') as string;
    const terminationDate = data.get('terminationDate') as string;
    const status = data.get('status') as string;
    const applicationIds = data.getAll('applications') as string[];

    await prisma.employee.update({
      where: { id: params.id },
      data: {
        name,
        emailPersonal,
        emailCompany,
        region,
        department,
        position,
        joiningDate: new Date(joiningDate),
        terminationDate: terminationDate ? new Date(terminationDate) : null,
        status,
        applications: {
          deleteMany: {},
          create: applicationIds.map((applicationId) => ({
            applicationId,
            status: 'REQUESTED',
            requestedById: 'system', // TODO: Get from session
          })),
        },
      },
    });

    redirect(`/employees/${params.id}`);
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Employee</h1>
        <Button variant="outline" asChild>
          <Link href={`/employees/${params.id}`}>Back to Details</Link>
        </Button>
      </div>

      <div className="mt-6">
        <EmployeeForm
          applications={applications}
          action={updateEmployee}
          employee={employee}
        />
      </div>
    </div>
  );
} 