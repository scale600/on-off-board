import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface EmployeePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EmployeePageProps): Promise<Metadata> {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
  });

  if (!employee) {
    return {
      title: 'Employee Not Found',
    };
  }

  return {
    title: `${employee.name} - Employee Details`,
    description: `View details for ${employee.name}`,
  };
}

async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          application: true,
        },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  return employee;
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const employee = await getEmployee(params.id);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{employee.name}</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/employees">Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/employees/${employee.id}/edit`}>Edit Employee</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Personal Email
              </dt>
              <dd className="mt-1">{employee.emailPersonal}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Company Email
              </dt>
              <dd className="mt-1">{employee.emailCompany || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Region
              </dt>
              <dd className="mt-1">
                <Badge variant="outline">{employee.region}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Department
              </dt>
              <dd className="mt-1">{employee.department}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Position
              </dt>
              <dd className="mt-1">{employee.position}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Employment Details</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1">
                <Badge
                  variant={employee.status === 'ACTIVE' ? 'default' : 'destructive'}
                >
                  {employee.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Joining Date
              </dt>
              <dd className="mt-1">
                {new Date(employee.joiningDate).toLocaleDateString()}
              </dd>
            </div>
            {employee.terminationDate && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Termination Date
                </dt>
                <dd className="mt-1">
                  {new Date(employee.terminationDate).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Applications</h2>
        <div className="mt-4 rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Application</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {employee.applications.map((ea) => (
                <tr key={ea.id} className="border-b">
                  <td className="px-4 py-2">{ea.application.name}</td>
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