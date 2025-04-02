# 데이터베이스 설계 문서 (Database Design Document)

## 1. 개요 (Overview)

본 문서는 온/오프보딩 시스템의 데이터베이스 설계를 설명합니다.

## 2. ERD (Entity Relationship Diagram)

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────┐
│   Employee   │       │EmployeeApplication  │       │ Application  │
├──────────────┤       ├─────────────────────┤       ├──────────────┤
│ id*         │       │ id*                 │       │ id*         │
│ name        │       │ employee_id*        │<>─────│ name        │
│ email_pers  │       │ application_id*     │       │ description │
│ email_comp  │       │ status             │       │ is_required │
│ region      │       │ requested_by       │       │ regions     │
│ department  │       │ created_at         │       │ created_at  │
│ position    │       │ updated_at         │       │ updated_at  │
│ join_date   │       └─────────────────────┘       └──────────────┘
│ term_date   │
│ status      │
│ created_at  │
│ updated_at  │
└──────────────┘
```

## 3. 테이블 상세 설명 (Table Details)

### 3.1 Employee

직원 정보를 저장하는 테이블

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 직원 고유 식별자 |
| name | VARCHAR(100) | NOT NULL | 직원 이름 |
| email_personal | VARCHAR(255) | NOT NULL, UNIQUE | 개인 이메일 |
| email_company | VARCHAR(255) | UNIQUE | 회사 이메일 |
| region | VARCHAR(10) | NOT NULL | 지역 (US, EU, KR, CN) |
| department | VARCHAR(100) | NOT NULL | 부서명 |
| position | VARCHAR(100) | NOT NULL | 직급 |
| joining_date | DATE | NOT NULL | 입사일 |
| termination_date | DATE | NULL | 퇴사일 |
| status | VARCHAR(20) | NOT NULL | 상태 (ACTIVE, TERMINATED) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### 3.2 Application

회사에서 사용하는 애플리케이션 정보

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 앱 고유 식별자 |
| name | VARCHAR(100) | NOT NULL | 앱 이름 |
| description | TEXT | NULL | 앱 설명 |
| is_required | BOOLEAN | NOT NULL | 필수 여부 |
| regions | VARCHAR[] | NOT NULL | 사용 가능 지역 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### 3.3 EmployeeApplication

직원별 앱 계정 상태 관리

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 매핑 고유 식별자 |
| employee_id | UUID | FK | 직원 ID |
| application_id | UUID | FK | 앱 ID |
| status | VARCHAR(20) | NOT NULL | 상태 (REQUESTED, CREATED, DELETED) |
| requested_by | UUID | FK | 요청자 ID |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

## 4. 인덱스 (Indexes)

### 4.1 Employee
- `idx_employee_email_company` ON `email_company`
- `idx_employee_email_personal` ON `email_personal`
- `idx_employee_region` ON `region`
- `idx_employee_status` ON `status`

### 4.2 EmployeeApplication
- `idx_emp_app_employee` ON `employee_id`
- `idx_emp_app_status` ON `status`
- `idx_emp_app_created` ON `created_at`

## 5. 제약조건 (Constraints)

### 5.1 외래 키 제약조건
```sql
ALTER TABLE employee_application
ADD CONSTRAINT fk_employee
FOREIGN KEY (employee_id)
REFERENCES employee(id);

ALTER TABLE employee_application
ADD CONSTRAINT fk_application
FOREIGN KEY (application_id)
REFERENCES application(id);
```

### 5.2 유니크 제약조건
```sql
ALTER TABLE employee
ADD CONSTRAINT uq_employee_email_company
UNIQUE (email_company);

ALTER TABLE employee
ADD CONSTRAINT uq_employee_email_personal
UNIQUE (email_personal);
```

## 6. 데이터 마이그레이션 (Data Migration)

### 6.1 초기 데이터
- 기본 애플리케이션 목록
- 지역별 필수 앱 설정
- 테스트 데이터

### 6.2 마이그레이션 스크립트
```sql
-- 애플리케이션 기본 데이터
INSERT INTO application (id, name, description, is_required, regions)
VALUES
  (uuid_generate_v4(), 'G Suite', 'Google Workspace', true, '{US,EU,KR,CN}'),
  (uuid_generate_v4(), 'Slack', 'Team Communication', true, '{US,EU,KR,CN}'),
  (uuid_generate_v4(), 'JIRA', 'Project Management', false, '{US,EU}');
```

## 7. 백업 전략 (Backup Strategy)

### 7.1 자동 백업
- 일일 전체 백업 (00:00 UTC)
- 시간별 증분 백업
- 보관 기간: 30일

### 7.2 수동 백업
- 주요 변경 전 수동 백업
- 분기별 전체 백업 아카이브 