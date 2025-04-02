import { ColumnDef } from '@tanstack/react-table';
import { Offboarding } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type OffboardingWithRelations = Offboarding & {
  employee: {
    name: string;
  };
  applications: {
    application: {
      name: string;
    };
  }[];
};

export const columns: ColumnDef<OffboardingWithRelations>[] = [
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'PENDING'
              ? 'default'
              : status === 'IN_PROGRESS'
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
    accessorKey: 'applications',
    header: 'Applications',
    cell: ({ row }) => {
      const applications = row.original.applications;
      return (
        <div className="flex flex-wrap gap-1">
          {applications.map((ea) => (
            <Badge key={ea.application.name} variant="outline">
              {ea.application.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = row.getValue('startDate') as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const date = row.getValue('endDate') as Date;
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const offboarding = row.original;
      return (
        <Button variant="ghost" asChild>
          <Link href={`/offboarding/${offboarding.id}`}>View Details</Link>
        </Button>
      );
    },
  },
]; 