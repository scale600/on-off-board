import { ColumnDef } from '@tanstack/react-table';
import { EmployeeApplication } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type EmployeeApplicationWithRelations = EmployeeApplication & {
  employee: {
    name: string;
  };
  application: {
    name: string;
    type: string;
  };
};

export const columns: ColumnDef<EmployeeApplicationWithRelations>[] = [
  {
    accessorKey: 'employee.name',
    header: 'Employee',
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <Link
          href={`/employees/${row.original.employeeId}`}
          className="text-primary hover:underline"
        >
          {employee.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'application.name',
    header: 'Application',
    cell: ({ row }) => {
      const application = row.original.application;
      return (
        <Link
          href={`/applications/${row.original.applicationId}`}
          className="text-primary hover:underline"
        >
          {application.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'application.type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.application.type;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'CREATED'
              ? 'default'
              : status === 'REQUESTED'
              ? 'secondary'
              : 'destructive'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employeeApplication = row.original;
      return (
        <Button variant="ghost" asChild>
          <Link
            href={`/employee-applications/${employeeApplication.id}`}
          >
            View Details
          </Link>
        </Button>
      );
    },
  },
]; 