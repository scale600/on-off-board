interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
  };
}

export function errorResponse<T>(error: string): ApiResponse<T> {
  return {
    data: null as T,
    error,
  };
}

export function parseQueryParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  return {
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
  };
} 