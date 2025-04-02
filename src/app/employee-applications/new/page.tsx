import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmployeeApplicationForm } from '@/components/forms/employee-application-form';

export const metadata: Metadata = {
  title: 'New Employee Application',
  description: 'Create a new employee application mapping',
};

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

export default async function NewEmployeeApplicationPage() {
  const [employees, applications] = await Promise.all([
    getEmployees(),
    getApplications(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Employee Application</h1>
        <Button variant="outline" asChild>
          <Link href="/employee-applications">Back to List</Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <EmployeeApplicationForm
          employees={employees}
          applications={applications}
        />
      </div>
    </div>
  );
} 