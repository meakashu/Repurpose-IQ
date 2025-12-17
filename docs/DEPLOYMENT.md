# 🚀 RepurposeIQ Deployment Guide

This guide covers deploying RepurposeIQ to production environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
   - [AWS](#aws-deployment)
   - [Google Cloud](#google-cloud-deployment)
   - [Azure](#azure-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL/TLS Setup](#ssltls-setup)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling](#scaling)
9. [Backup & Recovery](#backup--recovery)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Minimum (Development/Testing):**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB
- OS: Ubuntu 20.04+ / macOS / Windows with WSL2

**Recommended (Production):**
- CPU: 4+ cores
- RAM: 16 GB
- Storage: 100 GB SSD
- OS: Ubuntu 22.04 LTS

### Software Requirements

- Docker 24.0+
- Docker Compose 2.0+
- Node.js 18+ (if not using Docker)
- Python 3.9+ (if not using Docker)
- Nginx 1.18+ (for reverse proxy)
- Redis 7.0+ (for caching)

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/RepurposeIQ.git
cd RepurposeIQ
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.production
```

Edit `.env.production`:

```bash
# ========================================
# PRODUCTION CONFIGURATION
# ========================================

# Server
NODE_ENV=production
PORT=3000
CLIENT_URL=https://repurposeiq.com

# Security
JWT_SECRET=<generate-secure-secret-here>
JWT_EXPIRY=7d

# API Keys
GROQ_API_KEY=<your-production-groq-key>
GROQ_MODEL=llama-3.3-70b-versatile

# Database
DB_PATH=/var/lib/repurposeiq/data/pharma.db

# Redis
REDIS_URL=redis://redis:6379

# Python Service
PYTHON_SERVICE_URL=http://python-service:5000

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
LOG_LEVEL=info

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@repurposeiq.com
SMTP_PASS=<app-specific-password>
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret (32+ characters)
openssl rand -hex 32

# Generate session secret
openssl rand -hex 32
```

---

## Docker Deployment

### 1. Build Docker Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -t repurposeiq-client:latest ./client
docker build -t repurposeiq-server:latest ./server
docker build -t repurposeiq-python:latest ./python-service
```

### 2. Start Services

```bash
# Start all services in detached mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

### 3. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - VITE_API_URL=https://api.repurposeiq.com
    restart: always
    networks:
      - repurposeiq-network

  server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    volumes:
      - ./data:/var/lib/repurposeiq/data
      - ./uploads:/var/lib/repurposeiq/uploads
      - ./reports:/var/lib/repurposeiq/reports
    depends_on:
      - redis
      - python-service
    restart: always
    networks:
      - repurposeiq-network

  python-service:
    build:
      context: ./python-service
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    env_file:
      - .env.production
    volumes:
      - ./python-service/chroma_db:/app/chroma_db
    restart: always
    networks:
      - repurposeiq-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: always
    networks:
      - repurposeiq-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - server
    restart: always
    networks:
      - repurposeiq-network

networks:
  repurposeiq-network:
    driver: bridge

volumes:
  redis-data:
```

---

## Cloud Deployment

### AWS Deployment

#### Option 1: EC2 + Docker

```bash
# 1. Launch EC2 instance (t3.large or larger)
# Amazon Linux 2 / Ubuntu 22.04

# 2. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# 4. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Clone and deploy
git clone https://github.com/yourusername/RepurposeIQ.git
cd RepurposeIQ
docker-compose -f docker-compose.prod.yml up -d
```

#### Option 2: AWS ECS (Elastic Container Service)

```bash
# 1. Create ECR repositories
aws ecr create-repository --repository-name repurposeiq-client
aws ecr create-repository --repository-name repurposeiq-server
aws ecr create-repository --repository-name repurposeiq-python

# 2. Build and push images
$(aws ecr get-login --no-include-email --region us-east-1)

docker tag repurposeiq-client:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/repurposeiq-client:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/repurposeiq-client:latest

# 3. Create ECS task definition (use AWS Console or CLI)
# 4. Create ECS service
# 5. Configure Application Load Balancer
```

#### Option 3: AWS Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB application
eb init -p docker repurposeiq --region us-east-1

# 3. Create environment
eb create repurposeiq-prod

# 4. Deploy
eb deploy

# 5. Set environment variables
eb setenv GROQ_API_KEY=your-key JWT_SECRET=your-secret
```

---

### Google Cloud Deployment

#### Cloud Run (Serverless)

```bash
# 1. Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/your-project-id/repurposeiq-server

# 2. Deploy to Cloud Run
gcloud run deploy repurposeiq-server \
  --image gcr.io/your-project-id/repurposeiq-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GROQ_API_KEY=your-key,NODE_ENV=production

# 3. Get service URL
gcloud run services describe repurposeiq-server --format='value(status.url)'
```

#### GKE (Kubernetes)

```bash
# 1. Create GKE cluster
gcloud container clusters create repurposeiq-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-4 \
  --region=us-central1

# 2. Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 3. Configure secrets
kubectl create secret generic repurposeiq-secrets \
  --from-literal=groq-api-key=your-key \
  --from-literal=jwt-secret=your-secret
```

---

### Azure Deployment

#### Azure Container Instances

```bash
# 1. Create resource group
az group create --name RepurposeIQ --location eastus

# 2. Create container registry
az acr create --resource-group RepurposeIQ --name repurposeiqregistry --sku Basic

# 3. Build and push image
az acr build --registry repurposeiqregistry --image repurposeiq-server:latest .

# 4. Deploy container
az container create \
  --resource-group RepurposeIQ \
  --name repurposeiq-server \
  --image repurposeiqregistry.azurecr.io/repurposeiq-server:latest \
  --dns-name-label repurposeiq \
  --ports 3000 \
  --environment-variables GROQ_API_KEY=your-key NODE_ENV=production
```

---

## Nginx Configuration

Create `/etc/nginx/sites-available/repurposeiq.conf`:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=50r/s;

# Upstream servers
upstream backend {
    server localhost:3000;
    keepalive 64;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name repurposeiq.com www.repurposeiq.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name repurposeiq.com www.repurposeiq.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/repurposeiq.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/repurposeiq.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running agent workflows
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
    
    # WebSocket endpoint
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
    
    # Static files
    location / {
        limit_req zone=general_limit burst=100 nodelay;
        
        root /var/www/repurposeiq/client/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/repurposeiq.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL/TLS Setup

### Using Let's Encrypt (Recommended)

```bash
# 1. Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 2. Obtain SSL certificate
sudo certbot --nginx -d repurposeiq.com -d www.repurposeiq.com

# 3. Auto-renewal (already configured by Certbot)
sudo certbot renew --dry-run

# 4. Add cron job for auto-renewal
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

### Using Custom SSL Certificate

```bash
# Copy certificate files
sudo mkdir -p /etc/ssl/repurposeiq
sudo cp your-certificate.crt /etc/ssl/repurposeiq/
sudo cp your-private-key.key /etc/ssl/repurposeiq/
sudo cp ca-bundle.crt /etc/ssl/repurposeiq/

# Set permissions
sudo chmod 600 /etc/ssl/repurposeiq/your-private-key.key

# Update Nginx config to point to these files
```

---

## Monitoring & Logging

### Application Monitoring with PM2

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start server/index.js --name repurposeiq-server
pm2 start python-service/main.py --name repurposeiq-python --interpreter python3

# Enable startup script
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs repurposeiq-server
```

### Centralized Logging with Winston + CloudWatch

**server/utils/logger.js:**
```javascript
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new CloudWatchTransport({
      logGroupName: 'repurposeiq-logs',
      logStreamName: 'server',
      awsRegion: 'us-east-1'
    })
  ]
});

module.exports = logger;
```

### Error Tracking with Sentry

```javascript
// server/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Health Checks

```javascript
// server/routes/health.js
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      pythonService: await checkPythonService()
    }
  };
  
  const allHealthy = Object.values(health.services).every(s => s === 'healthy');
  const statusCode = allHealthy ? 200 : 503;
  
  res.status(statusCode).json(health);
});
```

---

## Scaling

### Horizontal Scaling with Load Balancer

```nginx
# Nginx upstream with multiple backend servers
upstream backend {
    least_conn;  # Load balancing algorithm
    
    server backend1.repurposeiq.com:3000 max_fails=3 fail_timeout=30s;
    server backend2.repurposeiq.com:3000 max_fails=3 fail_timeout=30s;
    server backend3.repurposeiq.com:3000 max_fails=3 fail_timeout=30s;
    
    keepalive 64;
}
```

### Auto-Scaling with Kubernetes

**k8s/hpa.yaml:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: repurposeiq-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: repurposeiq-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Backup & Recovery

### Database Backup

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/repurposeiq"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup SQLite database
cp /var/lib/repurposeiq/data/pharma.db "$BACKUP_DIR/pharma_$TIMESTAMP.db"

# Backup ChromaDB
tar -czf "$BACKUP_DIR/chromadb_$TIMESTAMP.tar.gz" /var/lib/repurposeiq/python-service/chroma_db/

# Upload to S3
aws s3 cp "$BACKUP_DIR/" s3://repurposeiq-backups/ --recursive

# Delete old backups (keep last 30 days)
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /usr/local/bin/backup.sh
```

### Disaster Recovery

1. **Download latest backup from S3:**
   ```bash
   aws s3 sync s3://repurposeiq-backups/ /var/backups/repurposeiq/
   ```

2. **Restore database:**
   ```bash
   cp /var/backups/repurposeiq/pharma_LATEST.db /var/lib/repurposeiq/data/pharma.db
   ```

3. **Restore ChromaDB:**
   ```bash
   tar -xzf /var/backups/repurposeiq/chromadb_LATEST.tar.gz -C /var/lib/repurposeiq/python-service/
   ```

4. **Restart services:**
   ```bash
   docker-compose -f docker-compose.prod.yml restart
   ```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs server
pm2 logs repurposeiq-server

# Check port availability
sudo lsof -i :3000

# Verify environment variables
docker-compose config
```

### High Memory Usage

```bash
# Check memory usage
docker stats

# Restart Python service (clear memory)
docker-compose restart python-service

# Adjust Redis memory limit
docker exec -it redis redis-cli
> CONFIG SET maxmemory 2gb
> CONFIG SET maxmemory-policy allkeys-lru
```

### Slow API Responses

```bash
# Check Redis connectivity
redis-cli ping

# Clear cache
redis-cli FLUSHALL

# Check database indexing
sqlite3 /var/lib/repurposeiq/data/pharma.db
> ANALYZE;
> .exit
```

---

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] SSL/TLS certificates are installed and valid
- [ ] Firewall rules allow only necessary ports (80, 443)
- [ ] Database backups are automated
- [ ] Monitoring and alerting are configured
- [ ] Error tracking (Sentry) is enabled
- [ ] Rate limiting is configured
- [ ] Security headers are set in Nginx
- [ ] CORS is configured for production domain
- [ ] Health check endpoint is responding
- [ ] Load testing completed
- [ ] Disaster recovery plan documented
- [ ] CI/CD pipeline configured

---

## Support

For deployment assistance:
- 📧 Email: devops@repurposeiq.com
- 📖 Docs: https://docs.repurposeiq.com/deployment
- 💬 Discord: https://discord.gg/repurposeiq
