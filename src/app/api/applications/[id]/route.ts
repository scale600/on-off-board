import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { applicationUpdateSchema } from '../types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!application) {
      return errorResponse(new Error('Application not found'));
    }

    return successResponse(application);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const data = applicationUpdateSchema.parse(body);

    const application = await prisma.application.update({
      where: { id: params.id },
      data,
    });

    return successResponse(application);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.application.delete({
      where: { id: params.id },
    });

    return successResponse({ message: 'Application deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
} 