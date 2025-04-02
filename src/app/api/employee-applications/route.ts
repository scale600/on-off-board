import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/utils/api';
import { z } from 'zod';

const employeeApplicationQuerySchema = z.object({
  employeeId: z.string().optional(),
  applicationId: z.string().optional(),
  status: z.enum(['CREATED', 'REQUESTED', 'APPROVED', 'REJECTED']).optional(),
  search: z.string().optional(),
});

const employeeApplicationSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationId: z.string().min(1, 'Application is required'),
  status: z.enum(['CREATED', 'REQUESTED', 'APPROVED', 'REJECTED']).default('CREATED'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = getPaginationParams(searchParams);
    const query = employeeApplicationQuerySchema.parse({
      employeeId: searchParams.get('employeeId'),
      applicationId: searchParams.get('applicationId'),
      status: searchParams.get('status') as any,
      search: searchParams.get('search'),
    });

    const where = {
      ...(query.employeeId && { employeeId: query.employeeId }),
      ...(query.applicationId && { applicationId: query.applicationId }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { employee: { name: { contains: query.search, mode: 'insensitive' } } },
          { application: { name: { contains: query.search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.employeeApplication.findMany({
        where,
        include: {
          employee: true,
          application: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.employeeApplication.count({ where }),
    ]);

    return successResponse({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching employee applications:', error);
    return errorResponse('Failed to fetch employee applications');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = employeeApplicationSchema.parse(body);

    const employeeApplication = await prisma.employeeApplication.create({
      data,
      include: {
        employee: true,
        application: true,
      },
    });

    return successResponse(employeeApplication);
  } catch (error) {
    console.error('Error creating employee application:', error);
    return errorResponse('Failed to create employee application');
  }
} 