import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    role: Role;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
  }
} 