import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmployeeApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EmployeeApplicationDetailPageProps): Promise<Metadata> {
  const employeeApplication = await prisma.employeeApplication.findUnique({
    where: { id: params.id },
    include: {
      employee: true,
      application: true,
    },
  });

  if (!employeeApplication) {
    return {
      title: 'Employee Application Not Found',
    };
  }

  return {
    title: `${employeeApplication.employee.name} - ${employeeApplication.application.name}`,
  };
}

async function getEmployeeApplication(id: string) {
  const employeeApplication = await prisma.employeeApplication.findUnique({
    where: { id },
    include: {
      employee: true,
      application: true,
    },
  });

  if (!employeeApplication) {
    notFound();
  }

  return employeeApplication;
}

export default async function EmployeeApplicationDetailPage({
  params,
}: EmployeeApplicationDetailPageProps) {
  const employeeApplication = await getEmployeeApplication(params.id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {employeeApplication.employee.name} - {employeeApplication.application.name}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/employee-applications">Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/employee-applications/${params.id}/edit`}>Edit</Link>
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
                      employeeApplication.status === 'CREATED'
                        ? 'default'
                        : employeeApplication.status === 'REQUESTED'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {employeeApplication.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="mt-1">
                  <Badge variant="outline">{employeeApplication.application.type}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="mt-1">
                  {new Date(employeeApplication.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="mt-1">
                  {new Date(employeeApplication.updatedAt).toLocaleDateString()}
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
                    href={`/employees/${employeeApplication.employeeId}`}
                    className="text-primary hover:underline"
                  >
                    {employeeApplication.employee.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1">{employeeApplication.employee.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="mt-1">
                  <Link
                    href={`/applications/${employeeApplication.applicationId}`}
                    className="text-primary hover:underline"
                  >
                    {employeeApplication.application.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{employeeApplication.application.description}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 