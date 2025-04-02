import { Application } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ApplicationFormProps {
  action: (data: FormData) => Promise<void>;
  application?: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    isRequired: boolean;
    regions: string[];
  };
}

export function ApplicationForm({
  action,
  application,
}: ApplicationFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={application?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={application?.type} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONBOARDING">Onboarding</SelectItem>
              <SelectItem value="OFFBOARDING">Offboarding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={application?.description || ''}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regions">Regions</Label>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region-us"
                name="regions"
                value="US"
                defaultChecked={application?.regions.includes('US')}
              />
              <Label htmlFor="region-us">US</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region-eu"
                name="regions"
                value="EU"
                defaultChecked={application?.regions.includes('EU')}
              />
              <Label htmlFor="region-eu">EU</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region-kr"
                name="regions"
                value="KR"
                defaultChecked={application?.regions.includes('KR')}
              />
              <Label htmlFor="region-kr">KR</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region-cn"
                name="regions"
                value="CN"
                defaultChecked={application?.regions.includes('CN')}
              />
              <Label htmlFor="region-cn">CN</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRequired"
              name="isRequired"
              value="true"
              defaultChecked={application?.isRequired}
            />
            <Label htmlFor="isRequired">Required Application</Label>
          </div>
        </div>
      </div>

      <Button type="submit">
        {application ? 'Update Application' : 'Create Application'}
      </Button>
    </form>
  );
} 