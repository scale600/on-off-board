import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { z } from 'zod';

const applicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

interface RouteParams {
  params: {
    id: string;
    applicationId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const data = applicationStatusSchema.parse(body);

    const offboardingApplication = await prisma.offboardingApplication.update({
      where: {
        offboardingId_applicationId: {
          offboardingId: params.id,
          applicationId: params.applicationId,
        },
      },
      data: {
        status: data.status,
      },
      include: {
        application: true,
      },
    });

    return successResponse(offboardingApplication);
  } catch (error) {
    console.error('Error updating offboarding application status:', error);
    return errorResponse('Failed to update offboarding application status');
  }
} 