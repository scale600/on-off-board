import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  emailPersonal: z.string().email('Invalid email format'),
  region: z.enum(['US', 'EU', 'KR', 'CN']),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  joiningDate: z.string().transform((str) => new Date(str)),
});

export const employeeUpdateSchema = employeeSchema.partial().extend({
  emailCompany: z.string().email('Invalid email format').optional(),
  terminationDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  status: z.enum(['ACTIVE', 'TERMINATED']).optional(),
});

export const employeeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  region: z.enum(['US', 'EU', 'KR', 'CN']).optional(),
  status: z.enum(['ACTIVE', 'TERMINATED']).optional(),
  search: z.string().optional(),
}); 