# Employee On/Off-boarding Management System

A web-based system for managing employee onboarding/offboarding processes in global corporations.

## Key Features

### Onboarding Process
- HR managers can register basic information for new employees
- Request and approval workflow for required application accounts
- Region-specific (US, EU, Korea, China) application account management

### Offboarding Process
- Automated account deactivation workflow
- Region-specific compliance checks
- Asset return management

## Technical Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/on-off-board.git
cd on-off-board
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## Database Schema

### Key Entities
- Employee
- Application
- EmployeeApplication
- User
- Offboarding
- OffboardingApplication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
