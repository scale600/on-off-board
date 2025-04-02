import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/utils/api';
import { applicationSchema, applicationQuerySchema } from './types';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = applicationQuerySchema.parse(searchParams);
    const { skip, take } = getPaginationParams(searchParams);

    const where: Prisma.ApplicationWhereInput = {
      ...(query.region && {
        regions: {
          has: query.region,
        },
      }),
      ...(query.isRequired !== undefined && { isRequired: query.isRequired }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.application.count({ where }),
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
    const data = applicationSchema.parse(body);

    const application = await prisma.application.create({
      data,
    });

    return successResponse(application);
  } catch (error) {
    return errorResponse(error);
  }
} 