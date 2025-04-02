import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OffboardingForm } from '@/components/forms/offboarding-form';

interface OffboardingEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OffboardingEditPageProps): Promise<Metadata> {
  const offboarding = await prisma.offboarding.findUnique({
    where: { id: params.id },
    include: {
      employee: true,
      applications: {
        include: {
          application: true,
        },
      },
    },
  });

  if (!offboarding) {
    return {
      title: 'Offboarding Not Found',
    };
  }

  return {
    title: `Edit ${offboarding.employee.name} - Offboarding`,
  };
}

async function getOffboarding(id: string) {
  const offboarding = await prisma.offboarding.findUnique({
    where: { id },
    include: {
      employee: true,
      applications: {
        include: {
          application: true,
        },
      },
    },
  });

  if (!offboarding) {
    notFound();
  }

  return offboarding;
}

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

export default async function OffboardingEditPage({
  params,
}: OffboardingEditPageProps) {
  const [offboarding, employees, applications] = await Promise.all([
    getOffboarding(params.id),
    getEmployees(),
    getApplications(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Edit {offboarding.employee.name} - Offboarding
        </h1>
        <Button variant="outline" asChild>
          <Link href={`/offboarding/${params.id}`}>Back to Details</Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <OffboardingForm
          offboarding={offboarding}
          employees={employees}
          applications={applications}
        />
      </div>
    </div>
  );
} 