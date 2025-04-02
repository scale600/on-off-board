import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const offboardingSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationIds: z.array(z.string()).min(1, 'At least one application is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

type OffboardingFormValues = z.infer<typeof offboardingSchema>;

interface OffboardingFormProps {
  offboarding?: {
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    applications: {
      applicationId: string;
    }[];
  };
  employees: {
    id: string;
    name: string;
  }[];
  applications: {
    id: string;
    name: string;
  }[];
}

export function OffboardingForm({
  offboarding,
  employees,
  applications,
}: OffboardingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OffboardingFormValues>({
    resolver: zodResolver(offboardingSchema),
    defaultValues: {
      employeeId: offboarding?.employeeId || '',
      applicationIds: offboarding?.applications.map((ea) => ea.applicationId) || [],
      startDate: offboarding
        ? new Date(offboarding.startDate).toISOString().split('T')[0]
        : '',
      endDate: offboarding
        ? new Date(offboarding.endDate).toISOString().split('T')[0]
        : '',
      status: (offboarding?.status as any) || 'PENDING',
    },
  });

  async function onSubmit(data: OffboardingFormValues) {
    try {
      setIsLoading(true);

      const response = await fetch(
        offboarding
          ? `/api/offboarding/${offboarding.id}`
          : '/api/offboarding',
        {
          method: offboarding ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save offboarding');
      }

      toast.success(
        `Offboarding ${offboarding ? 'updated' : 'created'} successfully`
      );

      router.push('/offboarding');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicationIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applications</FormLabel>
              <Select
                onValueChange={(value) => {
                  const currentValue = field.value || [];
                  if (currentValue.includes(value)) {
                    field.onChange(currentValue.filter((id) => id !== value));
                  } else {
                    field.onChange([...currentValue, value]);
                  }
                }}
                value={field.value?.[0] || ''}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select applications" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {applications.map((application) => (
                    <SelectItem key={application.id} value={application.id}>
                      {application.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : offboarding ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
} 