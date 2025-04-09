# API Documentation

## 1. 인증 API

### 1.1 로그인
```typescript
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": string,
  "password": string
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "role": string
  }
}
```

### 1.2 로그아웃
```typescript
POST /api/auth/logout

Response:
{
  "success": boolean
}
```

## 2. 직원 API

### 2.1 직원 목록 조회
```typescript
GET /api/employees
Authorization: Bearer {token}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- status: string (optional)
- region: string (optional)

Response:
{
  "data": [
    {
      "id": string,
      "name": string,
      "email": string,
      "status": string,
      "region": string,
      "department": string,
      "startDate": string
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### 2.2 직원 상세 조회
```typescript
GET /api/employees/:id
Authorization: Bearer {token}

Response:
{
  "id": string,
  "name": string,
  "email": string,
  "status": string,
  "region": string,
  "department": string,
  "startDate": string,
  "applications": [
    {
      "id": string,
      "name": string,
      "status": string
    }
  ]
}
```

## 3. 온보딩 API

### 3.1 온보딩 프로세스 시작
```typescript
POST /api/onboarding/start
Authorization: Bearer {token}

Request:
{
  "employeeId": string,
  "startDate": string,
  "department": string,
  "applications": string[]
}

Response:
{
  "id": string,
  "status": string,
  "tasks": [
    {
      "id": string,
      "name": string,
      "status": string
    }
  ]
}
```

### 3.2 온보딩 상태 업데이트
```typescript
PUT /api/onboarding/:id/status
Authorization: Bearer {token}

Request:
{
  "status": string,
  "taskId": string,
  "taskStatus": string
}

Response:
{
  "success": boolean,
  "updatedTasks": [
    {
      "id": string,
      "status": string
    }
  ]
}
```

## 4. 오프보딩 API

### 4.1 오프보딩 프로세스 시작
```typescript
POST /api/offboarding/start
Authorization: Bearer {token}

Request:
{
  "employeeId": string,
  "lastWorkingDate": string,
  "reason": string
}

Response:
{
  "id": string,
  "status": string,
  "tasks": [
    {
      "id": string,
      "name": string,
      "status": string
    }
  ]
}
```

### 4.2 자산 반환 상태 업데이트
```typescript
PUT /api/offboarding/:id/assets
Authorization: Bearer {token}

Request:
{
  "assets": [
    {
      "id": string,
      "status": string,
      "returnDate": string
    }
  ]
}

Response:
{
  "success": boolean,
  "updatedAssets": [
    {
      "id": string,
      "status": string
    }
  ]
}
```

## 5. 에러 응답 형식
```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details": any
  }
}

Error Codes:
- AUTH_001: 인증 실패
- AUTH_002: 권한 없음
- EMP_001: 직원 정보 없음
- EMP_002: 직원 정보 중복
- ONB_001: 온보딩 프로세스 실패
- OFF_001: 오프보딩 프로세스 실패
```

## 6. 웹훅
```typescript
POST {webhook_url}

Request:
{
  "event": string,
  "data": {
    "id": string,
    "type": string,
    "status": string,
    "timestamp": string
  }
}

Event Types:
- onboarding.started
- onboarding.completed
- offboarding.started
- offboarding.completed
- asset.returned
- account.deactivated
``` 