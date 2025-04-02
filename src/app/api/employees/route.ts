import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/utils/api';
import { employeeSchema, employeeQuerySchema } from './types';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = employeeQuerySchema.parse(searchParams);
    const { skip, take } = getPaginationParams(searchParams);

    const where: Prisma.EmployeeWhereInput = {
      ...(query.region && { region: query.region }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
          { emailPersonal: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
          { emailCompany: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy: { joiningDate: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return successResponse({
      items,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = employeeSchema.parse(body);

    const employee = await prisma.employee.create({
      data: {
        ...data,
        status: 'ACTIVE',
      },
    });

    return successResponse(employee);
  } catch (error) {
    return errorResponse(error);
  }
} 