# IT Requirements for Hotel VoG POC

**For IT Team Discussion - 2026-01-21**

---

## Executive Summary

This POC requires a simple Azure backend to securely call third-party APIs (Apify for review scraping, Microsoft Copilot for AI analysis) from a static HTML form hosted on OneDrive.

**Timeline:** POC launch in 2-3 weeks
**Scope:** Single hotel test, then scale to 10-20 properties
**Cost:** ~$100-200/month (Azure Functions + API usage)

---

## Architecture Overview

```
User (Hotel GM)
  ↓
Opens index.html from OneDrive folder
  ↓
[MSAL.js - Authenticates via Entra ID]
  ↓
Fills form & clicks "Analyze Reviews"
  ↓
POST to Azure Function (fetch-and-analyze)
  ↓
Azure Function:
  1. Validates auth token
  2. Calls Apify API (scrapes reviews)
  3. Calls Microsoft Copilot API (analyzes reviews)
  4. Returns JSON results
  ↓
Browser displays dashboard with analysis
```

---

## Required Azure Resources

### 1. Azure App Registration

**Purpose:** Secure authentication and API authorization

**Configuration:**
- **Name:** `hotel-vog-poc`
- **Supported Account Types:** Single tenant (our organization only)
- **Redirect URIs:**
  - Type: Single-page application (SPA)
  - URI: `https://[tenant].sharepoint.com/*` (wildcard for OneDrive folders)
- **API Permissions:**
  - Microsoft Graph: `User.Read` (delegated) - to identify user
  - **No OneDrive permissions needed** (files accessed via direct link, not API)

**Outputs Needed:**
- **Client ID** (will be embedded in HTML - safe to expose)
- **Tenant ID** (will be embedded in HTML - safe to expose)

---

### 2. Azure Function App

**Purpose:** Backend proxy to securely call third-party APIs

**Configuration:**
- **Runtime:** Node.js 20 LTS
- **Hosting Plan:** Consumption (pay-per-use)
- **Region:** Same as tenant (e.g., East US)
- **CORS:** `https://[tenant].sharepoint.com` (enable OneDrive access)
- **Managed Identity:** System-assigned (enable after creation - see below)

**Environment Variables (Application Settings):**
```
APIFY_API_TOKEN=apify_api_xxxxxxxxxxxxx
AZURE_OPENAI_ENDPOINT=https://[resource].openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o (or Copilot deployment name)
TENANT_ID=[your-tenant-id]
CLIENT_ID=[app-registration-client-id]
```

**Note:** No AZURE_OPENAI_KEY needed - we use **Managed Identity** instead (more secure, no API keys to manage)

**Functions to Deploy:**

#### Function 1: `fetch-and-analyze` (HTTP POST)
- **Route:** `/api/fetch-and-analyze`
- **Authentication:** Function-level (validates Entra ID token from header)
- **Input:** JSON with hotel URLs, date range
- **Process:**
  1. Validate bearer token (Azure AD)
  2. Call Apify API to scrape Google Maps, TripAdvisor, Booking.com
  3. Aggregate review data
  4. Call Microsoft Copilot with analysis prompt
  5. Return structured JSON results
- **Timeout:** 5 minutes (scraping can take 2-3 min)
- **Memory:** 512 MB

---

### 3. Managed Identity Setup (Recommended - More Secure Than API Keys)

**What:** Azure's built-in authentication that eliminates API keys for Azure OpenAI

**Why:**
- ✅ No API keys to manage or rotate
- ✅ Better security (no secrets can leak)
- ✅ Microsoft best practice
- ✅ Same setup time (actually faster!)
- ✅ Easier compliance

**Setup Steps (5 minutes):**

1. **Enable Managed Identity on Function App:**
   - Go to: Function App → Settings → Identity
   - Toggle "System assigned" to **On**
   - Click Save
   - Copy the Object (principal) ID

2. **Grant Function Access to Azure OpenAI:**
   - Go to: Azure OpenAI resource → Access control (IAM)
   - Click: + Add → Add role assignment
   - Role: **Cognitive Services OpenAI User**
   - Assign access to: **Managed Identity**
   - Select: hotel-vog-functions
   - Click: Review + assign

3. **Done!** No API key needed in environment variables

**Detailed Guide:** See [MANAGED-IDENTITY-GUIDE.md](./MANAGED-IDENTITY-GUIDE.md)

---

## Security Requirements

### Authentication Flow
1. User opens HTML file in OneDrive
2. MSAL.js redirects to Microsoft login
3. User authenticates with Entra ID
4. MSAL.js receives access token
5. Browser includes token in `Authorization: Bearer` header when calling Azure Function
6. Azure Function validates token before processing

### API Key Protection & Managed Identity
- ✅ **Azure OpenAI:** Uses Managed Identity (no API key needed)
  - Function App has system-assigned identity
  - Identity granted "Cognitive Services OpenAI User" role
  - Azure handles authentication automatically
  - No secrets to rotate or manage
- ✅ **Apify API:** Token stored in Azure Function environment variables (never in browser)
- ✅ Only authenticated users can call Azure Function
- ✅ No public API endpoints

**Why Managed Identity?**
- Industry best practice (Microsoft recommended)
- No API keys to manage or rotate
- Better security (no keys can leak)
- Easier compliance (automatic audit trail)
- Same setup time as API keys (actually faster!)

### Data Storage
- **OneDrive:** HTML files only (no sensitive data)
- **Browser localStorage:** Form drafts only (cleared on logout)
- **No persistent database** for POC

---

## Third-Party API Accounts

### Apify (Review Scraping Service)
- **Account Holder:** [Your IT team or Marketing team]
- **Plan:** Starter ($49/month for ~25-30 hotels)
- **API Token:** Provided to IT for storage in Azure Function
- **Cost per Analysis:** ~$1.50-2.00 (scrapes 50 reviews × 3 sources)

### Microsoft Copilot / Azure OpenAI
- **Account:** Existing enterprise Copilot license
- **API Access:** Need API endpoint + key for programmatic access
- **Cost per Analysis:** ~$0.10-0.50 (depends on prompt length)
- **Question for IT:** Do we have Azure OpenAI deployment already, or use Copilot Studio API?

---

## Deployment Model

### OneDrive Folder Structure
```
OneDrive (Hotel VoG POC)
├── anantara-siam/
│   ├── index.html (static app)
│   ├── assets/
│   │   ├── app.js
│   │   ├── styles.css
│   └── README.txt (instructions)
├── park-hyatt-dubai/
│   ├── index.html
│   ├── assets/
│   └── README.txt
└── SETUP-GUIDE.md
```

### Distribution
- IT creates OneDrive folders for each hotel
- Shares folder link with hotel GM
- GM opens `index.html` in browser
- MSAL.js handles authentication
- No installation required

---

## IT Team Deliverables

**Before POC Launch:**
1. ✅ Create Azure App Registration
   - Provide Client ID + Tenant ID to dev team
2. ✅ Deploy Azure Function App
   - Configure environment variables with API keys
   - Enable CORS for SharePoint/OneDrive domains
3. ✅ Provide Azure OpenAI/Copilot API credentials
   - Endpoint URL
   - API Key
   - Deployment name
4. ✅ Test authentication flow
   - Confirm MSAL.js works with App Registration
   - Confirm Azure Function validates tokens

**Timeline:** 1 week for setup + 1 week for testing = 2 weeks total

---

## Testing Plan

### Phase 1: IT Team Testing (Week 1)
1. Deploy Azure Function to staging
2. Test with Postman (validate auth token handling)
3. Test Apify API call (fetch 10 reviews)
4. Test Copilot API call (analyze sample data)
5. Confirm end-to-end flow works

### Phase 2: Single Hotel Pilot (Week 2)
1. Select one hotel (ideally with tech-savvy GM)
2. Create OneDrive folder with HTML files
3. GM completes form and submits
4. IT monitors Azure Function logs
5. Validate results quality
6. Gather feedback

### Phase 3: Scale to 10 Hotels (Week 3-4)
1. Create folders for 10 hotels
2. Provide training/instructions
3. Monitor usage and costs
4. Iterate based on feedback

---

## Cost Estimate

### POC (1 Hotel, 10 Submissions)
| Resource | Cost |
|----------|------|
| Azure Function (Consumption) | ~$5 |
| Apify API (10 × $2) | ~$20 |
| Copilot API (10 × $0.30) | ~$3 |
| **Total** | **~$28** |

### Production (20 Hotels, 50 Submissions/Month)
| Resource | Monthly Cost |
|----------|--------------|
| Azure Function (Consumption) | ~$25 |
| Apify API (50 × $2) | ~$100 |
| Copilot API (50 × $0.30) | ~$15 |
| **Total** | **~$140/month** |

---

## Risk Mitigation

### Security
- **Risk:** API keys leaked in browser
  - **Mitigation:** Keys stored server-side only, never in HTML
- **Risk:** Unauthorized access to analysis tool
  - **Mitigation:** Entra ID authentication required

### Cost
- **Risk:** Runaway API usage
  - **Mitigation:** Azure Function rate limiting (10 requests/minute per user)
- **Risk:** Apify overcharges
  - **Mitigation:** Set Apify usage alerts at $100/month

### Reliability
- **Risk:** Azure Function timeout
  - **Mitigation:** 5-minute timeout, retry logic in UI
- **Risk:** Apify API downtime
  - **Mitigation:** Graceful error handling, manual fallback option

---

## Questions for IT Team

1. **Azure OpenAI Access:** Do we have an existing Azure OpenAI deployment, or should we use Copilot Studio API?
2. **CORS Policy:** Can you whitelist `*.sharepoint.com` for Azure Function CORS, or do we need specific tenant URL?
3. **Monitoring:** What logging/monitoring do you recommend (Application Insights)?
4. **Rate Limiting:** Should we implement per-user rate limits? (Suggested: 10 requests/hour)
5. **Data Retention:** How long should Azure Function logs be retained? (Suggested: 30 days)
6. **Deployment Method:** Do you prefer Azure DevOps pipeline or manual deployment for Function code?

---

## Next Steps

**Today (After Meeting):**
1. IT confirms feasibility and timeline
2. IT provides Azure OpenAI credentials (or Copilot API endpoint)
3. Dev team receives Client ID + Tenant ID for App Registration

**This Week:**
1. IT creates App Registration
2. IT deploys Azure Function to staging
3. Dev team builds static HTML with MSAL.js integration
4. Dev team provides Function code to IT

**Next Week:**
1. IT + Dev test end-to-end flow
2. Select pilot hotel
3. Deploy to production

**Week 3:**
1. Pilot hotel testing
2. Gather feedback
3. Iterate

---

## Support Contacts

**Dev Team:** [Your name/email]
**IT Lead:** [IT contact]
**Apify Support:** support@apify.com
**Microsoft Support:** [Your enterprise support contact]

---

**Document Version:** 1.0
**Last Updated:** 2026-01-21
**Prepared By:** Dev Team
**Review With:** IT Team Lead, Security Team
