import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offboarding',
  description: 'Manage employee offboarding processes',
};

async function getOffboarding() {
  return prisma.offboarding.findMany({
    include: {
      employee: true,
      applications: {
        include: {
          application: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function OffboardingPage() {
  const offboarding = await getOffboarding();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Offboarding</h1>
        <Button asChild>
          <Link href="/offboarding/new">New Offboarding</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={offboarding} />
    </div>
  );
} 