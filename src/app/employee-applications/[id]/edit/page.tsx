import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmployeeApplicationForm } from '@/components/forms/employee-application-form';

interface EmployeeApplicationEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EmployeeApplicationEditPageProps): Promise<Metadata> {
  const employeeApplication = await prisma.employeeApplication.findUnique({
    where: { id: params.id },
    include: {
      employee: true,
      application: true,
    },
  });

  if (!employeeApplication) {
    return {
      title: 'Employee Application Not Found',
    };
  }

  return {
    title: `Edit ${employeeApplication.employee.name} - ${employeeApplication.application.name}`,
  };
}

async function getEmployeeApplication(id: string) {
  const employeeApplication = await prisma.employeeApplication.findUnique({
    where: { id },
    include: {
      employee: true,
      application: true,
    },
  });

  if (!employeeApplication) {
    notFound();
  }

  return employeeApplication;
}

async function getEmployees() {
  return prisma.employee.findMany({
    orderBy: { name: 'asc' },
  });
}

async function getApplications() {
  return prisma.application.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function EmployeeApplicationEditPage({
  params,
}: EmployeeApplicationEditPageProps) {
  const [employeeApplication, employees, applications] = await Promise.all([
    getEmployeeApplication(params.id),
    getEmployees(),
    getApplications(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Edit {employeeApplication.employee.name} - {employeeApplication.application.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href={`/employee-applications/${params.id}`}>Back to Details</Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <EmployeeApplicationForm
          employeeApplication={employeeApplication}
          employees={employees}
          applications={applications}
        />
      </div>
    </div>
  );
} 