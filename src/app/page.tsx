import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to On/Off Board</h1>
        <p className="text-xl text-muted-foreground">
          Employee onboarding and offboarding management system
        </p>
        <Button asChild size="lg">
          <Link href="/auth/signin">Sign In to Continue</Link>
        </Button>
      </div>
    </div>
  );
} 