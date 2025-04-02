import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { employeeUpdateSchema } from '../types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          include: {
            application: true,
          },
        },
      },
    });

    if (!employee) {
      return errorResponse(new Error('Employee not found'));
    }

    return successResponse(employee);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const data = employeeUpdateSchema.parse(body);

    const employee = await prisma.employee.update({
      where: { id: params.id },
      data,
    });

    return successResponse(employee);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    });

    return successResponse({ message: 'Employee deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
} 