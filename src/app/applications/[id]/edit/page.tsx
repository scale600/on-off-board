import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ApplicationForm } from '../../_components/application-form';

interface ApplicationEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ApplicationEditPageProps): Promise<Metadata> {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    return {
      title: 'Application Not Found',
    };
  }

  return {
    title: `Edit ${application.name}`,
    description: `Edit application information for ${application.name}`,
  };
}

async function getApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  return application;
}

export default async function ApplicationEditPage({
  params,
}: ApplicationEditPageProps) {
  const application = await getApplication(params.id);

  async function updateApplication(data: FormData) {
    'use server';

    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const type = data.get('type') as string;
    const isRequired = data.get('isRequired') === 'true';
    const regions = data.getAll('regions') as string[];

    await prisma.application.update({
      where: { id: params.id },
      data: {
        name,
        description,
        type,
        isRequired,
        regions,
      },
    });

    redirect(`/applications/${params.id}`);
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Application</h1>
        <Button variant="outline" asChild>
          <Link href={`/applications/${params.id}`}>Back to Details</Link>
        </Button>
      </div>

      <div className="mt-6">
        <ApplicationForm
          action={updateApplication}
          application={application}
        />
      </div>
    </div>
  );
} 