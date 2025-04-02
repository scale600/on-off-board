import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of employee onboarding and offboarding status',
};

async function getStats() {
  const [totalEmployees, activeEmployees, pendingApplications, completedApplications] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.employeeApplication.count({ where: { status: 'REQUESTED' } }),
    prisma.employeeApplication.count({ where: { status: 'CREATED' } }),
  ]);

  return {
    totalEmployees,
    activeEmployees,
    pendingApplications,
    completedApplications,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
          <p className="mt-2 text-2xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Employees</h3>
          <p className="mt-2 text-2xl font-bold">{stats.activeEmployees}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Pending Applications</h3>
          <p className="mt-2 text-2xl font-bold">{stats.pendingApplications}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Completed Applications</h3>
          <p className="mt-2 text-2xl font-bold">{stats.completedApplications}</p>
        </div>
      </div>
    </div>
  );
} 