import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ApplicationsClient from './applications-client';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage application information',
};

async function getApplications() {
  const applications = await prisma.application.findMany({
    orderBy: { name: 'asc' },
  });
  return applications;
}

export default async function ApplicationsPage() {
  const applications = await getApplications();
  return <ApplicationsClient applications={applications} />;
} 