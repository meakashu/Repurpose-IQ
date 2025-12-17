# 📡 RepurposeIQ API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.repurposeiq.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "organization": "Pharma Corp"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "analyst"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Agent Endpoints

### POST /agents/analyze
Execute multi-agent analysis workflow.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "query": "Analyze Metformin repurposing opportunities",
  "agents": ["iqvia", "patent", "clinical", "exim"],  // Optional
  "options": {
    "depth": "comprehensive",  // "quick" | "standard" | "comprehensive"
    "regions": ["North America", "Europe"],
    "outputFormat": "pdf"  // "json" | "pdf" | "excel"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis_456",
    "status": "processing",
    "websocketUrl": "ws://localhost:3000/ws/analysis_456",
    "estimatedTime": "45 minutes"
  }
}
```

**WebSocket Stream:**
```json
// Agent status updates
{
  "type": "AGENT_STATUS",
  "agent": "iqvia",
  "status": "running",
  "message": "Analyzing market trends for Metformin..."
}

// Partial results
{
  "type": "PARTIAL_RESULT",
  "agent": "iqvia",
  "data": {
    "cagr_5yr": 5.4,
    "market_size_usd": "2.3B"
  }
}

// Final completion
{
  "type": "COMPLETE",
  "analysisId": "analysis_456",
  "reportUrl": "/api/reports/analysis_456"
}
```

---

### GET /agents/analysis/:id
Retrieve analysis results.

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "analysis_456",
    "query": "Analyze Metformin repurposing opportunities",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T11:12:00Z",
    "results": {
      "iqvia": { /* market data */ },
      "patent": { /* IP landscape */ },
      "clinical": { /* trials data */ },
      "exim": { /* supply chain */ }
    },
    "insights": [
      "High market growth in oncology indication",
      "Patent expiry in 2026 - generic entry risk",
      "123 active clinical trials globally"
    ],
    "recommendations": [
      "Explore oncology repurposing pathway",
      "Conduct deep EXIM supply chain analysis",
      "Initiate regulatory consultation for 505(b)(2)"
    ],
    "reportUrl": "/api/reports/analysis_456.pdf"
  }
}
```

---

## Report Endpoints

### GET /reports/:analysisId
Download generated report.

**Authentication Required:** Yes

**Query Parameters:**
- `format`: `pdf` | `excel` | `json` (default: `pdf`)

**Response:**
- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Binary file download

---

### GET /reports/list
List all user's reports.

**Authentication Required:** Yes

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `status`: Filter by `completed` | `processing` | `failed`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "analysis_456",
        "query": "Analyze Metformin",
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00Z",
        "reportUrl": "/api/reports/analysis_456.pdf"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42
    }
  }
}
```

---

## Mock API Endpoints

### GET /mock/iqvia/sales-trends
Simulate IQVIA market intelligence API.

**Query Parameters:**
- `drug`: Drug name (required)
- `region`: Geographic region (optional)

**Response (200 OK):**
```json
{
  "drug": "Metformin",
  "cagr_5yr": 5.4,
  "market_size_usd": "2.3B",
  "top_competitors": ["GenericCo", "PharmaX"],
  "regional_breakdown": {
    "North America": 45,
    "Europe": 30,
    "Asia Pacific": 25
  }
}
```

---

### GET /mock/patent/search
Simulate USPTO patent search API.

**Query Parameters:**
- `drug`: Drug name (required)
- `includeExpired`: Include expired patents (default: false)

**Response (200 OK):**
```json
{
  "drug": "Metformin",
  "patents": [
    {
      "id": "US1234567",
      "title": "Metformin composition for diabetes treatment",
      "status": "Expired",
      "expiryDate": "2020-05-15",
      "assignee": "Pharma Corp"
    }
  ],
  "freedom_to_operate": true
}
```

---

### GET /mock/exim/import-data
Simulate EXIM trade data API.

**Query Parameters:**
- `drug`: Drug/API name (required)
- `year`: Trade year (default: current year)

**Response (200 OK):**
```json
{
  "drug": "Metformin API",
  "year": 2024,
  "import_volume_kg": 1250000,
  "top_suppliers": [
    {
      "country": "India",
      "percentage": 65,
      "risk_score": "Low"
    },
    {
      "country": "China",
      "percentage": 35,
      "risk_score": "Medium"
    }
  ],
  "supply_chain_risk": "Medium"
}
```

---

### GET /mock/clinicaltrials/search
Simulate ClinicalTrials.gov API.

**Query Parameters:**
- `drug`: Drug name (required)
- `indication`: Disease/indication (optional)
- `phase`: Trial phase (optional)

**Response (200 OK):**
```json
{
  "drug": "Metformin",
  "total_trials": 847,
  "phase_distribution": {
    "Phase 1": 120,
    "Phase 2": 350,
    "Phase 3": 280,
    "Phase 4": 97
  },
  "top_indications": [
    {
      "indication": "Type 2 Diabetes",
      "trial_count": 430
    },
    {
      "indication": "Oncology",
      "trial_count": 123
    }
  ],
  "recent_trials": [ /* ... */ ]
}
```

---

## Error Responses

All endpoints follow consistent error response format:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "constraint": "Must be valid email address"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_789"
  }
}
```

---

## Rate Limiting

- **Default:** 100 requests per minute per IP
- **Authenticated:** 500 requests per minute per user
- **Agent Analysis:** 10 concurrent workflows per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1610712345
```

---

## Webhooks (Enterprise Feature)

Configure webhooks to receive analysis completion notifications.

### POST /webhooks/register

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["analysis.completed", "analysis.failed"],
  "secret": "your_webhook_secret"
}
```

**Webhook Payload:**
```json
{
  "event": "analysis.completed",
  "timestamp": "2024-01-15T11:12:00Z",
  "data": {
    "analysisId": "analysis_456",
    "reportUrl": "https://api.repurposeiq.com/api/reports/analysis_456.pdf"
  },
  "signature": "sha256=..." // HMAC signature for verification
}
```

---

## SDK Examples

### JavaScript/Node.js
```javascript
const RepurposeIQ = require('repurposeiq-sdk');

const client = new RepurposeIQ({
  apiKey: 'your_api_key',
  baseURL: 'http://localhost:3000/api'
});

// Analyze drug
const analysis = await client.agents.analyze({
  query: 'Analyze Metformin repurposing opportunities',
  depth: 'comprehensive'
});

// Stream results
analysis.on('progress', (update) => {
  console.log(`${update.agent}: ${update.message}`);
});

analysis.on('complete', async (result) => {
  const pdf = await client.reports.download(result.id, 'pdf');
  fs.writeFileSync('report.pdf', pdf);
});
```

### Python
```python
from repurposeiq import RepurposeIQClient

client = RepurposeIQClient(api_key='your_api_key')

# Analyze drug
analysis = client.agents.analyze(
    query='Analyze Metformin repurposing opportunities',
    depth='comprehensive'
)

# Wait for completion
result = analysis.wait()

# Download report
with open('report.pdf', 'wb') as f:
    f.write(client.reports.download(result.id, format='pdf'))
```

---

## Support

For API support:
- 📧 Email: api-support@repurposeiq.com
- 📖 Interactive Docs: http://localhost:3000/api-docs (Swagger UI)
- 🐛 Report Issues: https://github.com/yourusername/RepurposeIQ/issues
