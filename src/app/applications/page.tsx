import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage application information',
};

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { name: 'asc' },
  });

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