# 배포 가이드 (Deployment Guide)

## 1. 개요 (Overview)

본 문서는 온/오프보딩 시스템의 배포 및 운영 프로세스를 설명합니다.

## 2. 사전 요구사항 (Prerequisites)

### 2.1 AWS 계정 설정
- AWS 계정 생성
- IAM 사용자 및 역할 설정
- 필요한 권한:
  - ECS
  - Aurora
  - CloudFront
  - S3
  - Route53
  - ACM

### 2.2 도메인 및 SSL
- 도메인 등록
- SSL 인증서 발급 (ACM)
- Route53 호스팅 영역 설정

### 2.3 개발 환경
- Node.js v18 이상
- Docker
- AWS CLI
- GitHub 계정

## 3. 인프라 설정 (Infrastructure Setup)

### 3.1 네트워크 구성
```bash
# VPC 생성
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# 서브넷 생성
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.1.0/24
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.2.0/24
```

### 3.2 데이터베이스 설정
```bash
# Aurora 클러스터 생성
aws rds create-db-cluster \
  --db-cluster-identifier onboard-cluster \
  --engine aurora-postgresql \
  --master-username admin \
  --master-user-password <password>
```

### 3.3 ECS 클러스터
```bash
# ECS 클러스터 생성
aws ecs create-cluster --cluster-name onboard-cluster

# 작업 정의 등록
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

## 4. 애플리케이션 배포 (Application Deployment)

### 4.1 환경 변수 설정
```bash
# .env 파일 생성
cat > .env << EOL
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
EOL
```

### 4.2 데이터베이스 마이그레이션
```bash
# 개발 환경
npm run prisma:migrate:dev

# 프로덕션 환경
npm run prisma:migrate:deploy
```

### 4.3 애플리케이션 빌드 및 배포
```bash
# Docker 이미지 빌드
docker build -t onboard-app .

# ECR 푸시
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account>.dkr.ecr.<region>.amazonaws.com
docker tag onboard-app:latest <aws-account>.dkr.ecr.<region>.amazonaws.com/onboard-app:latest
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/onboard-app:latest

# ECS 서비스 업데이트
aws ecs update-service --cluster onboard-cluster --service onboard-service --force-new-deployment
```

## 5. CI/CD 파이프라인 (CI/CD Pipeline)

### 5.1 GitHub Actions 워크플로우
```yaml
name: Deploy to Production

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
      - name: Build and push
        run: |
          docker build -t onboard-app .
          docker push ...
      - name: Deploy to ECS
        run: |
          aws ecs update-service ...
```

### 5.2 배포 환경 구성
- Development (dev)
- Staging (staging)
- Production (prod)

## 6. 모니터링 및 로깅 (Monitoring & Logging)

### 6.1 CloudWatch 설정
```bash
# 로그 그룹 생성
aws logs create-log-group --log-group-name /ecs/onboard-app

# 메트릭 필터 설정
aws logs put-metric-filter \
  --log-group-name /ecs/onboard-app \
  --filter-name errors \
  --filter-pattern "ERROR" \
  --metric-transformations \
    metricName=ApplicationErrors,metricNamespace=OnboardApp,metricValue=1
```

### 6.2 알림 설정
```bash
# SNS 주제 생성
aws sns create-topic --name onboard-alerts

# CloudWatch 경보 생성
aws cloudwatch put-metric-alarm \
  --alarm-name high-error-rate \
  --metric-name ApplicationErrors \
  --namespace OnboardApp \
  --threshold 10 \
  --period 300 \
  --evaluation-periods 2 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:region:account-id:onboard-alerts
```

## 7. 백업 및 복구 (Backup & Recovery)

### 7.1 데이터베이스 백업
```bash
# 수동 스냅샷 생성
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier onboard-cluster \
  --db-cluster-snapshot-identifier manual-snapshot-1
```

### 7.2 복구 절차
1. 스냅샷에서 새 클러스터 생성
2. 애플리케이션 환경 변수 업데이트
3. ECS 서비스 재배포

## 8. 보안 설정 (Security Configuration)

### 8.1 네트워크 보안
```bash
# 보안 그룹 생성
aws ec2 create-security-group \
  --group-name onboard-sg \
  --description "Security group for onboard application"

# 규칙 추가
aws ec2 authorize-security-group-ingress \
  --group-id <security-group-id> \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### 8.2 IAM 정책
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

## 9. 문제 해결 (Troubleshooting)

### 9.1 일반적인 문제
- 데이터베이스 연결 실패
- ECS 작업 시작 실패
- 로그 확인 방법

### 9.2 디버깅 명령어
```bash
# ECS 작업 로그 확인
aws ecs describe-tasks --cluster onboard-cluster --tasks <task-id>

# CloudWatch 로그 확인
aws logs get-log-events \
  --log-group-name /ecs/onboard-app \
  --log-stream-name <log-stream>
```

## 10. 유지보수 (Maintenance)

### 10.1 정기 유지보수
- 보안 패치 적용
- 데이터베이스 최적화
- 로그 정리

### 10.2 스케일링
- Auto Scaling 설정
- 부하 테스트
- 성능 모니터링 