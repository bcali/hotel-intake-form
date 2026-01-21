# Azure Functions - Hotel VoG Backend

Backend API for Hotel Voice of Guest POC

---

## Functions

### `fetch-and-analyze` (POST /api/fetch-and-analyze)

Fetches hotel reviews from Apify and analyzes with Microsoft Copilot.

**Authentication:** Bearer token (Azure AD)

**Request:**
```json
{
  "hotelName": "Anantara Siam",
  "timePeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-20"
  },
  "reviewSources": {
    "googleMaps": "https://www.google.com/maps/...",
    "tripAdvisor": "https://www.tripadvisor.com/...",
    "otaUrls": {
      "booking": "https://www.booking.com/..."
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "hotelName": "Anantara Siam",
  "totalReviews": 109,
  "analysis": {
    "sentiment": {
      "overall": 78,
      "trend": "improving"
    },
    "topPositiveThemes": [
      {
        "theme": "Exceptional staff service",
        "mentions": 42,
        "impact": "high"
      }
    ],
    "topNegativeThemes": [
      {
        "theme": "Room maintenance issues",
        "mentions": 18,
        "impact": "medium"
      }
    ],
    "actionItems": [
      {
        "priority": "P0",
        "department": "Housekeeping",
        "action": "Implement daily AC maintenance checks",
        "impact": "Addresses 18 guest complaints"
      }
    ],
    "executiveSummary": "Overall sentiment is positive (78/100)..."
  },
  "rawReviews": {
    "googleMaps": [...],
    "tripAdvisor": [...],
    "booking": [...]
  },
  "processedAt": "2026-01-21T10:15:30.123Z",
  "processedBy": "gm@anantara.com"
}
```

---

## Local Development

### Prerequisites
- Node.js 20+
- Azure Functions Core Tools v4
- Apify API token
- Azure OpenAI credentials

### Setup

1. Install dependencies:
```bash
cd azure-functions
npm install
```

2. Create `local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "APIFY_API_TOKEN": "apify_api_xxxxxxxxxxxxx",
    "AZURE_OPENAI_ENDPOINT": "https://[resource].openai.azure.com/",
    "AZURE_OPENAI_KEY": "xxxxxxxxxxxxx",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4o",
    "TENANT_ID": "[your-tenant-id]",
    "CLIENT_ID": "[app-registration-client-id]"
  },
  "Host": {
    "CORS": "*"
  }
}
```

3. Run locally:
```bash
func start
```

4. Test with curl:
```bash
curl -X POST http://localhost:7071/api/fetch-and-analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [token]" \
  -d @test-payload.json
```

---

## Deployment to Azure

### Using Azure CLI

1. Login:
```bash
az login
```

2. Create Function App:
```bash
az functionapp create \
  --resource-group hotel-vog-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name hotel-vog-functions \
  --storage-account hotelvogstg
```

3. Configure environment variables:
```bash
az functionapp config appsettings set \
  --name hotel-vog-functions \
  --resource-group hotel-vog-rg \
  --settings \
    "APIFY_API_TOKEN=apify_api_xxxxx" \
    "AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com/" \
    "AZURE_OPENAI_KEY=xxxxx" \
    "AZURE_OPENAI_DEPLOYMENT=gpt-4o" \
    "TENANT_ID=xxxxx" \
    "CLIENT_ID=xxxxx"
```

4. Deploy code:
```bash
func azure functionapp publish hotel-vog-functions
```

### Using VS Code

1. Install Azure Functions extension
2. Right-click on `azure-functions` folder
3. Select "Deploy to Function App"
4. Follow prompts

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APIFY_API_TOKEN` | Apify API token for review scraping | `apify_api_xxxxx` |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | `https://xxx.openai.azure.com/` |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key | `xxxxxxxxxxxxx` |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name for GPT model | `gpt-4o` or `copilot` |
| `TENANT_ID` | Azure AD tenant ID | `xxxxxxxx-xxxx-...` |
| `CLIENT_ID` | App Registration client ID | `xxxxxxxx-xxxx-...` |

---

## Error Handling

### 401 Unauthorized
- **Cause:** Invalid or missing bearer token
- **Solution:** Ensure MSAL.js is configured correctly in frontend

### 500 Apify Error
- **Cause:** Invalid URL or Apify API failure
- **Solution:** Check Apify dashboard for run logs

### 500 Copilot Error
- **Cause:** Invalid prompt or API key
- **Solution:** Check Azure OpenAI deployment status

---

## Monitoring

View logs in Azure Portal:
1. Go to Function App
2. Click "Log stream"
3. Monitor real-time execution

Or use Application Insights:
1. Enable Application Insights in Function App settings
2. View detailed metrics and traces

---

## Cost Optimization

- **Consumption Plan:** Only pay for execution time
- **Apify:** Limit to 50 reviews per source
- **Copilot:** Use temperature=0.3 to reduce token usage

---

## Security Checklist

- ✅ API keys stored in environment variables (not code)
- ✅ CORS restricted to SharePoint/OneDrive domains
- ✅ Bearer token validation on every request
- ✅ HTTPS enforced in production
- ✅ No sensitive data logged

---

## Support

**Issues:** Contact dev team or IT support
**Apify Support:** support@apify.com
**Azure Support:** [Your enterprise support portal]
