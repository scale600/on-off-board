import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { ZodError } from 'zod';

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export function errorResponse(error: unknown): NextResponse<ApiResponse<never>> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

export const DEFAULT_PAGE_SIZE = 10;

export function getPaginationParams(
  searchParams?: { [key: string]: string | string[] | undefined }
): { skip: number; take: number } {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || DEFAULT_PAGE_SIZE;
  
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
} 