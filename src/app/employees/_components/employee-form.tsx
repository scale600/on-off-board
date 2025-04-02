import { Application } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface EmployeeFormProps {
  applications: Application[];
  action: (data: FormData) => Promise<void>;
  employee?: {
    id: string;
    name: string;
    emailPersonal: string;
    emailCompany?: string | null;
    region: string;
    department: string;
    position: string;
    joiningDate: Date;
    terminationDate?: Date | null;
    status: string;
    applications: { applicationId: string }[];
  };
}

export function EmployeeForm({ applications, action, employee }: EmployeeFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={employee?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailPersonal">Personal Email</Label>
          <Input
            id="emailPersonal"
            name="emailPersonal"
            type="email"
            defaultValue={employee?.emailPersonal}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailCompany">Company Email</Label>
          <Input
            id="emailCompany"
            name="emailCompany"
            type="email"
            defaultValue={employee?.emailCompany || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select name="region" defaultValue={employee?.region} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="EU">EU</SelectItem>
              <SelectItem value="KR">KR</SelectItem>
              <SelectItem value="CN">CN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            defaultValue={employee?.department}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            defaultValue={employee?.position}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input
            id="joiningDate"
            name="joiningDate"
            type="date"
            defaultValue={employee?.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : ''}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terminationDate">Termination Date</Label>
          <Input
            id="terminationDate"
            name="terminationDate"
            type="date"
            defaultValue={employee?.terminationDate ? new Date(employee.terminationDate).toISOString().split('T')[0] : ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={employee?.status || 'ACTIVE'}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Applications</Label>
        <div className="grid gap-2 md:grid-cols-2">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center space-x-2">
              <Checkbox
                id={application.id}
                name="applications"
                value={application.id}
                defaultChecked={employee?.applications.some(
                  (ea) => ea.applicationId === application.id
                )}
              />
              <Label htmlFor={application.id}>{application.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit">
        {employee ? 'Update Employee' : 'Create Employee'}
      </Button>
    </form>
  );
} 