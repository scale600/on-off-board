# Database Schema Documentation

## 1. 엔티티 관계도 (ERD)
```
[User] 1--* [Employee]
[Employee] 1--* [OnboardingProcess]
[Employee] 1--* [OffboardingProcess]
[Employee] *--* [Application]
[Employee] 1--* [Asset]
[OnboardingProcess] 1--* [Task]
[OffboardingProcess] 1--* [Task]
```

## 2. 테이블 스키마

### 2.1 User
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(USER)
  department    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  isActive      Boolean   @default(true)
  employees     Employee[]
}

enum Role {
  ADMIN
  HR_MANAGER
  IT_MANAGER
  DEPARTMENT_MANAGER
  USER
}
```

### 2.2 Employee
```prisma
model Employee {
  id                String              @id @default(uuid())
  email             String              @unique
  name              String
  status            EmployeeStatus      @default(PENDING)
  region            Region
  department        String
  position          String
  startDate         DateTime
  endDate           DateTime?
  manager           User                @relation(fields: [managerId], references: [id])
  managerId         String
  onboardingProcess OnboardingProcess[]
  offboardingProcess OffboardingProcess[]
  applications      EmployeeApplication[]
  assets           Asset[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

enum EmployeeStatus {
  PENDING
  ACTIVE
  INACTIVE
  TERMINATED
}

enum Region {
  US
  EU
  KR
  CN
}
```

### 2.3 OnboardingProcess
```prisma
model OnboardingProcess {
  id          String        @id @default(uuid())
  employee    Employee      @relation(fields: [employeeId], references: [id])
  employeeId  String
  status      ProcessStatus @default(PENDING)
  startDate   DateTime
  endDate     DateTime?
  tasks       Task[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum ProcessStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### 2.4 OffboardingProcess
```prisma
model OffboardingProcess {
  id              String        @id @default(uuid())
  employee        Employee      @relation(fields: [employeeId], references: [id])
  employeeId      String
  status          ProcessStatus @default(PENDING)
  lastWorkingDate DateTime
  reason          String
  tasks           Task[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### 2.5 Task
```prisma
model Task {
  id                  String              @id @default(uuid())
  name                String
  description         String?
  status              TaskStatus          @default(PENDING)
  dueDate             DateTime?
  completedAt         DateTime?
  onboardingProcess   OnboardingProcess?  @relation(fields: [onboardingProcessId], references: [id])
  onboardingProcessId String?
  offboardingProcess  OffboardingProcess? @relation(fields: [offboardingProcessId], references: [id])
  offboardingProcessId String?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  BLOCKED
  CANCELLED
}
```

### 2.6 Application
```prisma
model Application {
  id          String                @id @default(uuid())
  name        String
  description String?
  type        ApplicationType
  region      Region[]
  employees   EmployeeApplication[]
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
}

model EmployeeApplication {
  id            String            @id @default(uuid())
  employee      Employee          @relation(fields: [employeeId], references: [id])
  employeeId    String
  application   Application       @relation(fields: [applicationId], references: [id])
  applicationId String
  status        ApplicationStatus @default(PENDING)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@unique([employeeId, applicationId])
}

enum ApplicationType {
  EMAIL
  VPN
  CRM
  ERP
  DEVELOPMENT
  COMMUNICATION
}

enum ApplicationStatus {
  PENDING
  ACTIVE
  INACTIVE
  BLOCKED
}
```

### 2.7 Asset
```prisma
model Asset {
  id          String      @id @default(uuid())
  name        String
  type        AssetType
  serialNumber String?
  employee    Employee    @relation(fields: [employeeId], references: [id])
  employeeId  String
  status      AssetStatus @default(ASSIGNED)
  assignedAt  DateTime    @default(now())
  returnedAt  DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum AssetType {
  LAPTOP
  MONITOR
  PHONE
  ACCESS_CARD
  SOFTWARE_LICENSE
}

enum AssetStatus {
  AVAILABLE
  ASSIGNED
  MAINTENANCE
  RETURNED
  LOST
}
```

## 3. 인덱스
```sql
-- Employee 테이블 인덱스
CREATE INDEX idx_employee_email ON Employee(email);
CREATE INDEX idx_employee_status ON Employee(status);
CREATE INDEX idx_employee_region ON Employee(region);

-- Process 테이블 인덱스
CREATE INDEX idx_onboarding_status ON OnboardingProcess(status);
CREATE INDEX idx_offboarding_status ON OffboardingProcess(status);

-- Task 테이블 인덱스
CREATE INDEX idx_task_status ON Task(status);
CREATE INDEX idx_task_due_date ON Task(dueDate);

-- Asset 테이블 인덱스
CREATE INDEX idx_asset_status ON Asset(status);
CREATE INDEX idx_asset_type ON Asset(type);
```

## 4. 데이터 마이그레이션
```bash
# 개발 환경
npx prisma migrate dev

# 스테이징 환경
npx prisma migrate deploy

# 프로덕션 환경
npx prisma migrate deploy
```

## 5. 백업 정책
- 전체 백업: 매일 00:00 UTC
- 증분 백업: 매 6시간
- 백업 보관 기간: 30일
- 백업 위치: AWS S3 / Azure Blob Storage 