'use client';

import { Application } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ApplicationsClientProps {
  applications: Application[];
}

export default function ApplicationsClient({ applications }: ApplicationsClientProps) {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button asChild>
          <Link href="/applications/new">Add Application</Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={applications} />
      </div>
    </div>
  );
} 