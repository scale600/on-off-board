# Employee On/Off-boarding Management System

A web-based system for managing employee onboarding/offboarding processes across global corporations.

## Key Features

### Onboarding Process
- HR managers register basic information for new employees
- Request and approval workflow for required app accounts
- Region-specific app account management (US, EU, Korea, China)
- Real-time account creation status monitoring

### Offboarding Process
- Email-based search for departing employees
- Automatic retrieval of created accounts
- Account deletion progress tracking
- Region-specific offboarding checklist management

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Shadcn/ui
- React Query
- React Hook Form

### Backend
- Next.js API Routes
- Prisma ORM
- AWS Aurora PostgreSQL
- NextAuth.js (Authentication)

### Infrastructure
- AWS ECS Fargate
- AWS Aurora PostgreSQL
- AWS S3 (static assets)
- AWS CloudFront (CDN)

## Database Schema

### Employee
- id: UUID (PK)
- name: String
- email_personal: String
- email_company: String
- region: Enum (US, EU, KR, CN)
- department: String
- position: String
- joining_date: Date
- termination_date: Date (nullable)
- status: Enum (ACTIVE, TERMINATED)

### Application
- id: UUID (PK)
- name: String
- description: String
- is_required: Boolean
- regions: String[]

### EmployeeApplication
- id: UUID (PK)
- employee_id: UUID (FK)
- application_id: UUID (FK)
- status: Enum (REQUESTED, CREATED, DELETED)
- requested_by: UUID
- created_at: DateTime
- updated_at: DateTime

## System Architecture

```
Client (Browser) <-> CloudFront <-> ECS Fargate (Next.js) <-> Aurora PostgreSQL
                                                          <-> AWS S3
```

## Local Development Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## API Endpoints

### Employees
- GET /api/employees - Get employee list
- POST /api/employees - Register new employee
- GET /api/employees/:id - Get employee details
- PUT /api/employees/:id - Update employee information
- DELETE /api/employees/:id - Delete employee information

### Applications
- GET /api/applications - Get application list
- POST /api/applications - Register new application
- GET /api/applications/:id - Get application details
- PUT /api/applications/:id - Update application information

### Employee Applications
- GET /api/employee-applications/:employeeId - Get employee's application accounts
- POST /api/employee-applications - Request application account creation
- PUT /api/employee-applications/:id - Update application account status

## Deployment Process

1. CI/CD pipeline through GitHub Actions
2. Automated testing and code quality checks
3. Automated deployment to AWS ECS Fargate
4. Automated database migrations

## Security Considerations

- Role-based access control (RBAC)
- API endpoint authentication and authorization
- Sensitive information encryption
- AWS IAM least privilege principle

## Future Improvements

1. Slack/Email notification integration
2. Automated account creation/deletion workflow
3. Audit log system
4. Reporting and analytics dashboard
5. Multi-region deployment support
