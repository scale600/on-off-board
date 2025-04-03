import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'emailPersonal',
    header: 'Personal Email',
  },
  {
    accessorKey: 'emailCompany',
    header: 'Company Email',
  },
  {
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => {
      const region = row.getValue('region') as string;
      return <Badge variant="outline">{region}</Badge>;
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Button variant="ghost" asChild>
          <Link href={`/employees/${employee.id}`}>View Details</Link>
        </Button>
      );
    },
  },
]; 