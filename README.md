# Employee On/Off-boarding Management System
# 직원 온/오프보딩 관리 시스템

글로벌 법인의 직원 온보딩/오프보딩 프로세스를 관리하는 웹 기반 시스템입니다.

## 주요 기능 (Key Features)

### 온보딩 프로세스 (Onboarding Process)
- HR 매니저가 신규 입사자 기본 정보 등록
- 필요한 앱 계정 생성 요청 및 승인 워크플로우
- 법인별(US, EU, Korea, China) 맞춤형 앱 계정 관리
- 실시간 계정 생성 상태 모니터링

### 오프보딩 프로세스 (Offboarding Process)
- 이메일 기반 퇴사 예정자 검색
- 생성된 계정 목록 자동 조회
- 계정 삭제 진행 상황 추적
- 법인별 오프보딩 체크리스트 관리

## 기술 스택 (Tech Stack)

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
- NextAuth.js (인증)

### Infrastructure
- AWS ECS Fargate
- AWS Aurora PostgreSQL
- AWS S3 (static assets)
- AWS CloudFront (CDN)

## 데이터베이스 구조 (Database Schema)

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

## 시스템 아키텍처 (System Architecture)

```
Client (Browser) <-> CloudFront <-> ECS Fargate (Next.js) <-> Aurora PostgreSQL
                                                          <-> AWS S3
```

## 로컬 개발 환경 설정 (Local Development Setup)

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

## 환경 변수 (Environment Variables)

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## API 엔드포인트 (API Endpoints)

### Employees
- GET /api/employees - 직원 목록 조회
- POST /api/employees - 신규 직원 등록
- GET /api/employees/:id - 직원 상세 정보
- PUT /api/employees/:id - 직원 정보 수정
- DELETE /api/employees/:id - 직원 정보 삭제

### Applications
- GET /api/applications - 앱 목록 조회
- POST /api/applications - 신규 앱 등록
- GET /api/applications/:id - 앱 상세 정보
- PUT /api/applications/:id - 앱 정보 수정

### Employee Applications
- GET /api/employee-applications/:employeeId - 직원별 앱 계정 목록
- POST /api/employee-applications - 앱 계정 생성 요청
- PUT /api/employee-applications/:id - 앱 계정 상태 업데이트

## 배포 프로세스 (Deployment Process)

1. GitHub Actions를 통한 CI/CD 파이프라인
2. 테스트 자동화 및 코드 품질 검사
3. AWS ECS Fargate 자동 배포
4. 데이터베이스 마이그레이션 자동화

## 보안 고려사항 (Security Considerations)

- Role-based 접근 제어 (RBAC)
- API 엔드포인트 인증 및 인가
- 민감 정보 암호화 저장
- AWS IAM 최소 권한 원칙 적용

## 향후 개선사항 (Future Improvements)

1. Slack/Email 알림 통합
2. 자동화된 계정 생성/삭제 워크플로우
3. 감사 로그 시스템
4. 리포팅 및 분석 대시보드
5. Multi-region 배포 지원
