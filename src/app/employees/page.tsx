import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { EmployeesList } from './_components/employees-list';

export const metadata: Metadata = {
  title: 'Employees',
  description: 'Manage employee information',
};

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <EmployeesList initialEmployees={employees} />;
} 