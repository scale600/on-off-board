import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { z } from 'zod';

const employeeApplicationUpdateSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationId: z.string().min(1, 'Application is required'),
  status: z.enum(['CREATED', 'REQUESTED', 'APPROVED', 'REJECTED']),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const employeeApplication = await prisma.employeeApplication.findUnique({
      where: { id: params.id },
      include: {
        employee: true,
        application: true,
      },
    });

    if (!employeeApplication) {
      return errorResponse('Employee application not found', 404);
    }

    return successResponse(employeeApplication);
  } catch (error) {
    console.error('Error fetching employee application:', error);
    return errorResponse('Failed to fetch employee application');
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const data = employeeApplicationUpdateSchema.parse(body);

    const employeeApplication = await prisma.employeeApplication.update({
      where: { id: params.id },
      data,
      include: {
        employee: true,
        application: true,
      },
    });

    return successResponse(employeeApplication);
  } catch (error) {
    console.error('Error updating employee application:', error);
    return errorResponse('Failed to update employee application');
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.employeeApplication.delete({
      where: { id: params.id },
    });

    return successResponse({ message: 'Employee application deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee application:', error);
    return errorResponse('Failed to delete employee application');
  }
} 