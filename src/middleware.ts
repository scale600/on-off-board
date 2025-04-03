export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard',
    '/employees/:path*',
    '/applications/:path*',
    '/settings/:path*',
  ],
}; 