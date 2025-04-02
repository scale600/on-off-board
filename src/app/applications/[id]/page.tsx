import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ApplicationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ApplicationPageProps): Promise<Metadata> {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    return {
      title: 'Application Not Found',
    };
  }

  return {
    title: `${application.name} - Application Details`,
    description: `View details for ${application.name}`,
  };
}

async function getApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      employees: {
        include: {
          employee: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return application;
}

export default async function ApplicationPage({
  params,
}: ApplicationPageProps) {
  const application = await getApplication(params.id);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{application.name}</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/applications">Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/applications/${application.id}/edit`}>
              Edit Application
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Application Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="mt-1">{application.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Type
              </dt>
              <dd className="mt-1">
                <Badge variant="outline">{application.type}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Required
              </dt>
              <dd className="mt-1">
                <Badge variant={application.isRequired ? 'default' : 'secondary'}>
                  {application.isRequired ? 'Yes' : 'No'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Regions
              </dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {application.regions.map((region) => (
                  <Badge key={region} variant="outline">
                    {region}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Total Requests
              </dt>
              <dd className="mt-1 text-2xl font-bold">
                {application.employees.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </dt>
              <dd className="mt-1 text-2xl font-bold">
                {
                  application.employees.filter(
                    (ea) => ea.status === 'REQUESTED'
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Completed Requests
              </dt>
              <dd className="mt-1 text-2xl font-bold">
                {
                  application.employees.filter(
                    (ea) => ea.status === 'CREATED'
                  ).length
                }
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Employee Requests</h2>
        <div className="mt-4 rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Requested At</th>
                <th className="px-4 py-2 text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {application.employees.map((ea) => (
                <tr key={ea.id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      href={`/employees/${ea.employee.id}`}
                      className="text-primary hover:underline"
                    >
                      {ea.employee.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="outline">{ea.status}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(ea.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(ea.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 