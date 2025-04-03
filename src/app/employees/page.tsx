import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import EmployeesClient from './employees-client';

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
  return <EmployeesClient employees={employees} />;
} 