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
import { toast } from 'sonner';

const employeeApplicationSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  applicationId: z.string().min(1, 'Application is required'),
  status: z.enum(['CREATED', 'REQUESTED', 'APPROVED', 'REJECTED']),
});

type EmployeeApplicationFormValues = z.infer<typeof employeeApplicationSchema>;

interface EmployeeApplicationFormProps {
  employeeApplication?: {
    id: string;
    employeeId: string;
    applicationId: string;
    status: string;
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

export function EmployeeApplicationForm({
  employeeApplication,
  employees,
  applications,
}: EmployeeApplicationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmployeeApplicationFormValues>({
    resolver: zodResolver(employeeApplicationSchema),
    defaultValues: {
      employeeId: employeeApplication?.employeeId || '',
      applicationId: employeeApplication?.applicationId || '',
      status: (employeeApplication?.status as any) || 'CREATED',
    },
  });

  async function onSubmit(data: EmployeeApplicationFormValues) {
    try {
      setIsLoading(true);

      const response = await fetch(
        employeeApplication
          ? `/api/employee-applications/${employeeApplication.id}`
          : '/api/employee-applications',
        {
          method: employeeApplication ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save employee application');
      }

      toast.success(
        `Employee application ${
          employeeApplication ? 'updated' : 'created'
        } successfully`
      );

      router.push('/employee-applications');
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
          name="applicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an application" />
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
                  <SelectItem value="CREATED">Created</SelectItem>
                  <SelectItem value="REQUESTED">Requested</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : employeeApplication ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
} 