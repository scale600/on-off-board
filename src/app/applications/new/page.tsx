import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ApplicationForm } from '../_components/application-form';

export const metadata: Metadata = {
  title: 'New Application',
  description: 'Create a new application',
};

export default async function NewApplicationPage() {
  async function createApplication(data: FormData) {
    'use server';

    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const type = data.get('type') as string;
    const isRequired = data.get('isRequired') === 'true';
    const regions = data.getAll('regions') as string[];

    const application = await prisma.application.create({
      data: {
        name,
        description,
        type,
        isRequired,
        regions,
      },
    });

    redirect(`/applications/${application.id}`);
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Application</h1>
        <Button variant="outline" asChild>
          <Link href="/applications">Back to List</Link>
        </Button>
      </div>

      <div className="mt-6">
        <ApplicationForm action={createApplication} />
      </div>
    </div>
  );
} 