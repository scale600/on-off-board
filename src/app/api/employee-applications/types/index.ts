import { z } from 'zod';
import { AppStatus } from '@prisma/client';

export const employeeApplicationSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  applicationIds: z.array(z.string().min(1, 'Application ID is required')),
  requestedById: z.string().min(1, 'Requester ID is required'),
});

export const employeeApplicationUpdateSchema = z.object({
  status: z.nativeEnum(AppStatus),
  deletionDate: z.string().transform((str) => new Date(str)).optional(),
});

export const employeeApplicationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  employeeId: z.string().optional(),
  applicationId: z.string().optional(),
  status: z.nativeEnum(AppStatus).optional(),
}); 