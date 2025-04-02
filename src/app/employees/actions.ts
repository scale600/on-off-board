'use server';

import { prisma } from '@/lib/prisma';

export async function getEmployees() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return employees;
} 