import { z } from 'zod';

export const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isRequired: z.boolean(),
  regions: z.array(z.enum(['US', 'EU', 'KR', 'CN'])),
});

export const applicationUpdateSchema = applicationSchema.partial();

export const applicationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  region: z.enum(['US', 'EU', 'KR', 'CN']).optional(),
  isRequired: z.string().transform(val => val === 'true').optional(),
  search: z.string().optional(),
}); 