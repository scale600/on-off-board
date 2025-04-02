import { Employee, Application, EmployeeApplication, User } from '@prisma/client';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export interface EmployeeCreateInput {
  name: string;
  emailPersonal: string;
  region: string;
  department: string;
  position: string;
  joiningDate: Date;
}

export interface EmployeeUpdateInput extends Partial<EmployeeCreateInput> {
  emailCompany?: string;
  terminationDate?: Date;
  status?: string;
}

export interface ApplicationCreateInput {
  name: string;
  description?: string;
  isRequired: boolean;
  regions: string[];
}

export interface EmployeeApplicationCreateInput {
  employeeId: string;
  applicationIds: string[];
}

export interface EmployeeApplicationUpdateInput {
  status: string;
  deletionDate?: Date;
}

// Re-export Prisma types
export type { Employee, Application, EmployeeApplication, User }; 