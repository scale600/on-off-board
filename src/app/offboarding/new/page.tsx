import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OffboardingForm } from '@/components/forms/offboarding-form';

export const metadata: Metadata = {
  title: 'New Offboarding',
  description: 'Create a new offboarding process',
};

async function getEmployees() {
  return prisma.employee.findMany({
    orderBy: { name: 'asc' },
  });
}

async function getApplications() {
  return prisma.application.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function NewOffboardingPage() {
  const [employees, applications] = await Promise.all([
    getEmployees(),
    getApplications(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Offboarding</h1>
        <Button variant="outline" asChild>
          <Link href="/offboarding">Back to List</Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <OffboardingForm
          employees={employees}
          applications={applications}
        />
      </div>
    </div>
  );
} 