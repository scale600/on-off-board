import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'On/Off Board',
  description: 'Employee onboarding and offboarding management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 