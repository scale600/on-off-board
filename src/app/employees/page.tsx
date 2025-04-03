import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Employees',
  description: 'Manage employee information',
};

async function getEmployees() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return employees;
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Button asChild>
          <Link href="/employees/new">Add Employee</Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={employees} />
      </div>
    </div>
  );
} 