import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OffboardingDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OffboardingDetailPageProps): Promise<Metadata> {
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
    title: `${offboarding.employee.name} - Offboarding`,
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

export default async function OffboardingDetailPage({
  params,
}: OffboardingDetailPageProps) {
  const offboarding = await getOffboarding(params.id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {offboarding.employee.name} - Offboarding
        </h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/offboarding">Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/offboarding/${params.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <Badge
                    variant={
                      offboarding.status === 'PENDING'
                        ? 'default'
                        : offboarding.status === 'IN_PROGRESS'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {offboarding.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                <dd className="mt-1">
                  {new Date(offboarding.startDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">End Date</dt>
                <dd className="mt-1">
                  {new Date(offboarding.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="mt-1">
                  {new Date(offboarding.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="mt-1">
                  {new Date(offboarding.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="mt-1">
                  <Link
                    href={`/employees/${offboarding.employeeId}`}
                    className="text-primary hover:underline"
                  >
                    {offboarding.employee.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1">{offboarding.employee.emailPersonal}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {offboarding.applications.map((ea) => (
                <div
                  key={ea.application.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{ea.application.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ea.application.description}
                    </p>
                  </div>
                  <Badge variant="outline">{ea.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 