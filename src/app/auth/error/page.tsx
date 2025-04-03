'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-red-500">
            {error || 'An unknown error occurred'}
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              Try Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 