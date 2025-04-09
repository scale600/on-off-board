# Deployment Guide

## 1. 시스템 요구사항

### 1.1 하드웨어 요구사항
- CPU: 4 cores 이상
- RAM: 8GB 이상
- 스토리지: 50GB SSD 이상

### 1.2 소프트웨어 요구사항
- Node.js 18 LTS
- PostgreSQL 15
- Redis 7
- Docker 24
- Docker Compose 2.x

## 2. 환경 설정

### 2.1 환경 변수
```bash
# 애플리케이션 설정
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# 데이터베이스 설정
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379

# 인증 설정
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# 외부 서비스 설정
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password

# 클라우드 스토리지
S3_BUCKET=your-bucket
S3_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### 2.2 SSL 인증서
```bash
# SSL 인증서 설정
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
```

## 3. 데이터베이스 설정

### 3.1 PostgreSQL 설정
```sql
-- 데이터베이스 생성
CREATE DATABASE onboard_prod;

-- 사용자 생성
CREATE USER onboard_user WITH PASSWORD 'your-password';

-- 권한 설정
GRANT ALL PRIVILEGES ON DATABASE onboard_prod TO onboard_user;
```

### 3.2 Redis 설정
```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
appendonly yes
```

## 4. Docker 배포

### 4.1 Dockerfile
```dockerfile
# Base image
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 실행
CMD ["npm", "start"]
```

### 4.2 Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/onboard_prod
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=onboard_prod
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 5. 클라우드 배포

### 5.1 AWS 배포
```bash
# ECS 클러스터 생성
aws ecs create-cluster --cluster-name onboard-cluster

# 태스크 정의 등록
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 서비스 생성
aws ecs create-service --cluster onboard-cluster --service-name onboard-service --task-definition onboard:1
```

### 5.2 Azure 배포
```bash
# AKS 클러스터 생성
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2

# 쿠버네티스 설정
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster

# 배포 적용
kubectl apply -f deployment.yaml
```

## 6. CI/CD 설정

### 6.1 GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: onboard
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster onboard-cluster --service onboard-service --force-new-deployment
```

## 7. 모니터링 설정

### 7.1 로그 설정
```javascript
// winston 로거 설정
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'onboard-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 7.2 모니터링 도구
- Prometheus 설정
- Grafana 대시보드
- ELK 스택 구성

## 8. 백업 및 복구

### 8.1 데이터베이스 백업
```bash
# PostgreSQL 백업
pg_dump -U user -d onboard_prod > backup.sql

# 자동 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -U user -d onboard_prod > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://backups/
```

### 8.2 장애 복구 절차
1. 서비스 상태 확인
2. 로그 분석
3. 백업 복원
4. 서비스 정상화 확인

## 9. 보안 설정

### 9.1 네트워크 보안
```nginx
# NGINX 보안 설정
server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS 설정
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### 9.2 애플리케이션 보안
- CORS 설정
- Rate Limiting
- XSS 방지
- CSRF 보호 