import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage system settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                defaultValue="On/Off Board"
                placeholder="Enter system name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="Enter admin email"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                placeholder="Enter SMTP server address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="Enter SMTP port"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                placeholder="Enter SMTP username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="Enter SMTP password"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Region Settings</CardTitle>
            <CardDescription>Configure region-specific settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRegion">Default Region</Label>
              <Input
                id="defaultRegion"
                placeholder="Enter default region"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Input
                id="timezone"
                placeholder="Enter default timezone"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
} 