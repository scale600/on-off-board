import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'System settings and configurations',
};

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Data Import/Export */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import and export system data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <form action="/api/data/export" method="POST" className="flex-1">
              <Button type="submit" className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </form>
            <div className="flex-1">
              <Label htmlFor="importFile" className="sr-only">Choose file</Label>
              <div className="flex gap-2">
                <Input
                  id="importFile"
                  type="file"
                  accept=".csv"
                  className="flex-1"
                />
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* General Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemName">System Name</Label>
            <Input id="systemName" placeholder="Enter system name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input id="adminEmail" type="email" placeholder="admin@example.com" />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure email server settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smtpServer">SMTP Server</Label>
            <Input id="smtpServer" placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" type="number" placeholder="587" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input id="smtpUsername" placeholder="Enter username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input id="smtpPassword" type="password" placeholder="Enter password" />
          </div>
        </CardContent>
      </Card>

      {/* Region Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Region Settings</CardTitle>
          <CardDescription>Configure regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultRegion">Default Region</Label>
            <Input id="defaultRegion" placeholder="Select default region" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" placeholder="Select timezone" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
} 