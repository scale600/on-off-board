# API 문서 (API Documentation)

## API 개요 (API Overview)

이 문서는 온/오프보딩 시스템의 API 엔드포인트들을 설명합니다.
Base URL: `https://api.onboard.company.com`

## 인증 (Authentication)

모든 API 요청은 Bearer 토큰이 필요합니다:
```
Authorization: Bearer <access_token>
```

## API 엔드포인트 (API Endpoints)

### 1. 직원 관리 (Employee Management)

#### 1.1 직원 목록 조회
```http
GET /api/employees
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `region`: string (optional)
- `status`: string (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email_personal": "string",
      "email_company": "string",
      "region": "string",
      "department": "string",
      "position": "string",
      "joining_date": "date",
      "status": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### 1.2 직원 등록
```http
POST /api/employees
```

**Request Body:**
```json
{
  "name": "string",
  "email_personal": "string",
  "region": "string",
  "department": "string",
  "position": "string",
  "joining_date": "date"
}
```

### 2. 앱 계정 관리 (Application Management)

#### 2.1 앱 목록 조회
```http
GET /api/applications
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "is_required": "boolean",
      "regions": ["string"]
    }
  ]
}
```

#### 2.2 직원별 앱 계정 요청
```http
POST /api/employee-applications
```

**Request Body:**
```json
{
  "employee_id": "uuid",
  "application_ids": ["uuid"]
}
```

### 3. 오프보딩 관리 (Offboarding Management)

#### 3.1 오프보딩 프로세스 시작
```http
POST /api/employees/{id}/offboard
```

**Request Body:**
```json
{
  "termination_date": "date",
  "reason": "string"
}
```

#### 3.2 앱 계정 삭제 상태 업데이트
```http
PUT /api/employee-applications/{id}
```

**Request Body:**
```json
{
  "status": "DELETED",
  "deletion_date": "date"
}
```

## 에러 응답 (Error Responses)

### 에러 포맷
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### 공통 에러 코드
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## 레이트 리밋 (Rate Limiting)

- 기본 제한: 100 requests/minute
- 초과 시 응답 헤더:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1623456789
  ```

## 버전 관리 (Versioning)

API 버전은 URL에 포함됩니다:
```
https://api.onboard.company.com/v1/employees
```

## 페이지네이션 (Pagination)

모든 목록 API는 페이지네이션을 지원합니다:
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `total`: 전체 항목 수

## CORS

허용된 오리진에서만 API 접근이 가능합니다:
```
Access-Control-Allow-Origin: https://onboard.company.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
``` 