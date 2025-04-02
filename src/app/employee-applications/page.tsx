import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Employee Applications',
  description: 'Manage employee application mappings',
};

async function getEmployeeApplications() {
  const employeeApplications = await prisma.employeeApplication.findMany({
    include: {
      employee: true,
      application: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return employeeApplications;
}

export default async function EmployeeApplicationsPage() {
  const employeeApplications = await getEmployeeApplications();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Applications</h1>
        <Button asChild>
          <Link href="/employee-applications/new">Add Mapping</Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={employeeApplications} />
      </div>
    </div>
  );
} 