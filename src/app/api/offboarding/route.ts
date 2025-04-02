import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/utils/api';
import { z } from 'zod';

const offboardingQuerySchema = z.object({
  employeeId: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  search: z.string().optional(),
});

const offboardingSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationIds: z.array(z.string()).min(1, 'At least one application is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = getPaginationParams(searchParams);
    const query = offboardingQuerySchema.parse({
      employeeId: searchParams.get('employeeId'),
      status: searchParams.get('status') as any,
      search: searchParams.get('search'),
    });

    const where = {
      ...(query.employeeId && { employeeId: query.employeeId }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { employee: { name: { contains: query.search, mode: 'insensitive' } } },
          { applications: { application: { name: { contains: query.search, mode: 'insensitive' } } } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.offboarding.findMany({
        where,
        include: {
          employee: true,
          applications: {
            include: {
              application: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.offboarding.count({ where }),
    ]);

    return successResponse({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching offboarding:', error);
    return errorResponse('Failed to fetch offboarding');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = offboardingSchema.parse(body);

    const offboarding = await prisma.offboarding.create({
      data: {
        employeeId: data.employeeId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
        applications: {
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
    console.error('Error creating offboarding:', error);
    return errorResponse('Failed to create offboarding');
  }
} 