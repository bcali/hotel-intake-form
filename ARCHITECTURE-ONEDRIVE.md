# OneDrive Deployment Architecture

**Hotel Voice of Guest - POC Architecture**

---

## Overview

Static HTML application hosted on OneDrive, calling Azure Functions backend for review scraping and AI analysis.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER (Hotel GM)                             │
│                                                                      │
│  Opens: https://[tenant].sharepoint.com/.../index.html              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     STATIC HTML (OneDrive)                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐           │
│  │  index.html                                          │           │
│  │  ├── MSAL.js (Authentication)                        │           │
│  │  ├── 4-Step Wizard (React)                           │           │
│  │  ├── Dashboard (Charts, KPIs)                        │           │
│  │  └── API Client (calls Azure Functions)             │           │
│  └──────────────────────────────────────────────────────┘           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐           │
│  │  assets/                                             │           │
│  │  ├── app.js (bundled React app)                      │           │
│  │  ├── styles.css (Tailwind CSS)                       │           │
│  │  └── msal-config.js                                  │           │
│  └──────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                        Step 1: User clicks "Sign In"
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE AD / ENTRA ID                               │
│                                                                      │
│  App Registration: hotel-vog-poc                                    │
│  ├── Client ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                │
│  ├── Tenant ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                │
│  ├── Redirect URI: https://[tenant].sharepoint.com/*                │
│  └── Permissions: User.Read                                         │
│                                                                      │
│  Returns: Bearer Token (JWT)                                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                        Step 2: Token stored in browser
                                    │
                        Step 3: User fills form & submits
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE FUNCTION APP                                │
│                                                                      │
│  Function: fetch-and-analyze                                        │
│  Endpoint: POST /api/fetch-and-analyze                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐           │
│  │  1. Validate bearer token (JWT)                      │           │
│  │  2. Extract user identity                            │           │
│  │  3. Call Apify API (scrape reviews)                  │           │
│  │  4. Call Copilot API (analyze reviews)               │           │
│  │  5. Return JSON results                              │           │
│  └──────────────────────────────────────────────────────┘           │
│                                                                      │
│  Environment Variables:                                             │
│  ├── APIFY_API_TOKEN (secure)                                       │
│  ├── AZURE_OPENAI_ENDPOINT (secure)                                 │
│  ├── AZURE_OPENAI_KEY (secure)                                      │
│  ├── TENANT_ID                                                      │
│  └── CLIENT_ID                                                      │
└─────────────────────────────────────────────────────────────────────┘
                │                                   │
                │                                   │
      Step 4: Fetch reviews          Step 5: Analyze reviews
                │                                   │
                ▼                                   ▼
┌──────────────────────────┐      ┌──────────────────────────────────┐
│      APIFY API           │      │   MICROSOFT COPILOT              │
│                          │      │   (Azure OpenAI)                 │
│  Actors:                 │      │                                  │
│  ├── Google Maps         │      │  Model: GPT-4o                   │
│  ├── TripAdvisor         │      │  Deployment: [your-deployment]   │
│  └── Booking.com         │      │                                  │
│                          │      │  Input: Reviews + Prompt         │
│  Returns: Reviews JSON   │      │  Output: Structured Analysis     │
└──────────────────────────┘      └──────────────────────────────────┘
                │                                   │
                └───────────────┬───────────────────┘
                                │
                    Step 6: Merge results
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BROWSER (Dashboard)                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐           │
│  │  Dashboard displays:                                 │           │
│  │  ├── Sentiment score (78/100)                        │           │
│  │  ├── Top positive themes                             │           │
│  │  ├── Top negative themes                             │           │
│  │  ├── Prioritized action items (P0, P1, P2)           │           │
│  │  ├── OTA comparison charts                           │           │
│  │  └── Executive summary                               │           │
│  └──────────────────────────────────────────────────────┘           │
│                                                                      │
│  GM can:                                                            │
│  ├── Download PDF report                                            │
│  ├── Share with department heads                                    │
│  └── Export action items to Excel                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Authentication Flow (MSAL.js)

```javascript
// In browser (index.html)
const msalConfig = {
  auth: {
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    authority: 'https://login.microsoftonline.com/[tenant-id]',
    redirectUri: window.location.origin
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// User clicks "Sign In"
const loginResponse = await msalInstance.loginPopup({
  scopes: ['User.Read']
});

// Store token
const accessToken = loginResponse.accessToken;
```

### 2. API Call Flow

```javascript
// User submits form
const response = await fetch('https://hotel-vog-functions.azurewebsites.net/api/fetch-and-analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    hotelName: 'Anantara Siam',
    timePeriod: { startDate: '2026-01-01', endDate: '2026-01-20' },
    reviewSources: {
      googleMaps: 'https://...',
      tripAdvisor: 'https://...',
      otaUrls: { booking: 'https://...' }
    }
  })
});

const result = await response.json();
// result.analysis contains dashboard data
```

### 3. Azure Function Processing

```javascript
// In Azure Function
module.exports = async function (context, req) {
  // 1. Validate token
  const token = req.headers.authorization.substring(7);
  const user = await validateToken(token);

  // 2. Fetch reviews from Apify
  const reviews = await fetchReviews(req.body.reviewSources);

  // 3. Analyze with Copilot
  const analysis = await analyzeWithCopilot(reviews);

  // 4. Return results
  return {
    status: 200,
    body: {
      success: true,
      analysis,
      rawReviews: reviews
    }
  };
};
```

---

## Security Model

### 1. Authentication
- **User Identity:** Entra ID (Microsoft 365 account)
- **Token Type:** JWT bearer token
- **Token Lifetime:** 1 hour (auto-refresh by MSAL.js)
- **Validation:** Azure Function validates signature against Azure AD public keys

### 2. Authorization
- **Who can access:** Any user in the tenant with valid credentials
- **API Protection:** Azure Function validates token on every request
- **No API keys in browser:** Apify and Copilot keys stored server-side only

### 3. Data Security
- **In Transit:** HTTPS enforced everywhere
- **At Rest:** No persistent storage (stateless processing)
- **Audit Trail:** Azure Function logs user email + timestamp for each request

---

## Deployment Model

### OneDrive Folder Structure

```
OneDrive for Business
└── Hotel VoG POC/
    ├── anantara-siam/
    │   ├── index.html          (static app)
    │   ├── assets/
    │   │   ├── app.js          (React bundle)
    │   │   ├── styles.css      (Tailwind)
    │   │   └── msal-config.js  (auth config)
    │   └── README.txt          (instructions)
    │
    ├── park-hyatt-dubai/
    │   ├── index.html
    │   ├── assets/
    │   └── README.txt
    │
    └── SETUP-GUIDE.md
```

### Distribution Process

1. **IT Team:**
   - Creates OneDrive folder for hotel
   - Deploys static HTML files
   - Shares folder link with GM

2. **GM:**
   - Clicks shared link
   - Opens `index.html` in browser
   - Signs in with Microsoft 365 account
   - Uses the form

3. **No Installation Required:**
   - Runs entirely in browser
   - No software to install
   - No IT support needed after initial setup

---

## Build Process

### From React App to Static HTML

```bash
# 1. Build React app
npm run build

# Output: dist/ folder with:
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css

# 2. Inject MSAL.js config
# Edit dist/index.html to add:
<script>
  window.MSAL_CONFIG = {
    clientId: '[client-id]',
    tenantId: '[tenant-id]',
    functionUrl: 'https://hotel-vog-functions.azurewebsites.net'
  };
</script>

# 3. Upload to OneDrive
# Copy dist/ contents to OneDrive folder
```

---

## Cost Breakdown

### Azure Costs (Per Month, 20 Hotels, 50 Submissions)

| Resource | Pricing | Usage | Monthly Cost |
|----------|---------|-------|--------------|
| Azure Function (Consumption) | $0.20 per 1M executions | 50 requests | $0.01 |
| Azure Function (Execution time) | $0.000016 per GB-s | 50 × 3 min | $25 |
| Apify API | ~$2 per hotel | 50 hotels | $100 |
| Copilot API | ~$0.30 per analysis | 50 analyses | $15 |
| **Total** | | | **~$140** |

### Free Resources
- OneDrive: Included in Microsoft 365
- Entra ID: Included in Microsoft 365
- MSAL.js: Free library

---

## Scalability

### Current POC (20 Hotels)
- Azure Function: Consumption plan (auto-scales)
- OneDrive: No limits on static files
- Apify: Handles concurrent requests
- Copilot: Rate limits apply (10 requests/min)

### Production Scale (200 Hotels)
- Add Azure Function rate limiting (prevent abuse)
- Upgrade Apify plan ($99/month for higher limits)
- Request Copilot quota increase from Microsoft
- Estimated cost: ~$500-700/month

---

## Monitoring & Logging

### Azure Function Logs
- **Application Insights:** Automatic telemetry
- **Log Stream:** Real-time execution logs
- **Metrics:** Request count, duration, errors

### What Gets Logged
- ✅ User email (who made request)
- ✅ Timestamp
- ✅ Hotel name
- ✅ Review count fetched
- ✅ Analysis success/failure
- ❌ Review content (not logged for privacy)
- ❌ API keys (never logged)

---

## Disaster Recovery

### Azure Function Failure
- **Fallback:** Manual workflow (download JSON, use Claude manually)
- **Recovery Time:** IT redeploys function (30 minutes)

### Apify API Failure
- **Fallback:** Manual review copying from websites
- **Recovery Time:** Apify usually recovers within 1 hour

### Copilot API Failure
- **Fallback:** Use Claude.ai or ChatGPT manually
- **Recovery Time:** Microsoft usually recovers within 2 hours

---

## Limitations

### POC Scope (What's NOT Included)
- ❌ No persistent database
- ❌ No email notifications
- ❌ No scheduled analysis (only on-demand)
- ❌ No multi-user collaboration
- ❌ No historical trend tracking
- ❌ No PDF export (browser print only)

### Production Requirements (Future)
- ✅ Azure SQL for historical data
- ✅ Power Automate for email notifications
- ✅ Azure Logic Apps for scheduled runs
- ✅ SharePoint for collaboration
- ✅ Power BI for trend dashboards

---

## Success Metrics

### Technical KPIs
- Response time < 3 minutes (P95)
- Success rate > 95%
- Authentication failure rate < 1%
- Cost per analysis < $3

### Business KPIs
- GM adoption rate > 80%
- Time saved vs manual: > 30 min/hotel
- Report quality score: > 8/10
- Would recommend to other properties: > 90%

---

## Next Steps

1. **IT Setup (Week 1):**
   - Create App Registration
   - Deploy Azure Function
   - Configure environment variables

2. **Dev Build (Week 1):**
   - Build static HTML from React app
   - Integrate MSAL.js
   - Connect to Azure Function API
   - Test end-to-end flow

3. **Pilot (Week 2):**
   - Deploy to 1 hotel
   - GM testing
   - Gather feedback

4. **Scale (Week 3-4):**
   - Deploy to 10-20 hotels
   - Monitor usage and costs
   - Iterate based on feedback

---

**Version:** 1.0
**Last Updated:** 2026-01-21
**Owner:** Dev Team + IT Team
