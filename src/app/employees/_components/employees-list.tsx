'use client';

import { useState } from 'react';
import { Employee } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '../columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmployeesListProps {
  initialEmployees: Employee[];
}

export function EmployeesList({ initialEmployees }: EmployeesListProps) {
  const [employees] = useState<Employee[]>(initialEmployees);

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