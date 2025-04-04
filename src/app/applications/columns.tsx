'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Application } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant="outline">{type}</Badge>;
    },
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
      const application = row.original;
      return (
        <Button variant="ghost" asChild>
          <Link href={`/applications/${application.id}`}>View Details</Link>
        </Button>
      );
    },
  },
]; 