import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ApplicationStatusProps {
  offboardingId: string;
  applicationId: string;
  currentStatus: string;
}

export function ApplicationStatus({
  offboardingId,
  applicationId,
  currentStatus,
}: ApplicationStatusProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateStatus(status: string) {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/offboarding/${offboardingId}/applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      toast.success('Application status updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={updateStatus}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
} 