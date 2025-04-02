import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { z } from 'zod';

const offboardingUpdateSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationIds: z.array(z.string()).min(1, 'At least one application is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
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
      return errorResponse('Offboarding not found', 404);
    }

    return successResponse(offboarding);
  } catch (error) {
    console.error('Error fetching offboarding:', error);
    return errorResponse('Failed to fetch offboarding');
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const data = offboardingUpdateSchema.parse(body);

    const offboarding = await prisma.offboarding.update({
      where: { id: params.id },
      data: {
        employeeId: data.employeeId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
        applications: {
          deleteMany: {},
          create: data.applicationIds.map((applicationId) => ({
            applicationId,
            status: 'PENDING',
          })),
        },
      },
      include: {
        employee: true,
        applications: {
          include: {
            application: true,
          },
        },
      },
    });

    return successResponse(offboarding);
  } catch (error) {
    console.error('Error updating offboarding:', error);
    return errorResponse('Failed to update offboarding');
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.offboarding.delete({
      where: { id: params.id },
    });

    return successResponse({ message: 'Offboarding deleted successfully' });
  } catch (error) {
    console.error('Error deleting offboarding:', error);
    return errorResponse('Failed to delete offboarding');
  }
} 