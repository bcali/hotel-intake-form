# IT Meeting Summary - Hotel VoG POC

**Meeting Date:** 2026-01-21
**Prepared For:** IT Team Discussion

---

## Quick Summary

We're building a proof-of-concept tool for hotel GMs to analyze guest reviews using:
- **Frontend:** Static HTML hosted on OneDrive (no install needed)
- **Backend:** Azure Functions calling Apify (review scraping) + Copilot (AI analysis)
- **Auth:** Azure AD via App Registration
- **Timeline:** 2-3 weeks to pilot with 1 hotel

---

## What We Need from IT

### 1. Azure App Registration 
Create an App Registration for authentication:

- **Name:** `hotel-vog-poc`
- **Type:** Single tenant
- **Redirect URI:** `https://[tenant].sharepoint.com/*` (SPA type)
- **Permissions:** `User.Read` (delegated, with admin consent)

**Output needed:**
- Client ID (safe to expose in browser)
- Tenant ID (safe to expose in browser)
- Client secret

### 2. Azure Function App 
Deploy serverless backend:

- **Name:** `hotel-vog-functions`
- **Runtime:** Node.js 20
- **Plan:** Consumption (pay-per-use)
- **Function Code:** We provide (Node.js code ready to deploy)
- **Environment Variables:**
  - `APIFY_API_TOKEN` (for review scraping)
  - `AZURE_OPENAI_ENDPOINT` (for AI analysis)
  - `AZURE_OPENAI_DEPLOYMENT` (model name, e.g., `gpt-4o`)
  - `TENANT_ID` (from App Registration)
  - `CLIENT_ID` (from App Registration)

**Note:** No AZURE_OPENAI_KEY needed - we use **Managed Identity** (more secure!)

### 3. Azure OpenAI Access with Managed Identity (Best Practice)
We need programmatic API access for AI analysis:

-  Azure OpenAI with Managed Identity
  - Enable System-Assigned Managed Identity on Function App
  - Grant "Cognitive Services OpenAI User" role to Function
  - **No API key needed** - Azure handles authentication automatically
  - **Benefits:** No secrets to manage, automatic rotation, better security

**What we need:**
- API endpoint URL (e.g., `https://[resource].openai.azure.com/`)
- Deployment name (e.g., `gpt-4o`)
- **No API key if using Managed Identity** ✅

---

## Architecture in 60 Seconds

```
User opens index.html from OneDrive
  ↓
Signs in with Microsoft 365 account (MSAL.js)
  ↓
Fills form with hotel URLs + date range
  ↓
Clicks "Analyze"
  ↓
Browser calls Azure Function (with auth token)
  ↓
Azure Function:
  - Validates token
  - Calls Apify to scrape 50 reviews from Google/TripAdvisor/Booking
  - Calls Copilot to analyze reviews
  - Returns structured JSON
  ↓
Browser displays dashboard (sentiment, themes, action items)
```

**Key Security:**
- **Managed Identity:** No API keys for Azure OpenAI (Microsoft best practice)
- Apify API key stored server-side only (never exposed in browser)
- Only authenticated users can call Azure Function (token validation)
- No persistent storage (stateless processing)

---

## Cost Estimate

### Pilot (1 Hotel, 10 Submissions)
- Azure Function: ~$5
- Apify: ~$20 (review scraping)
- Copilot: ~$3 (AI analysis)
- **Total: ~$28**

### Production (20 Hotels, 50 Submissions/Month)
- Azure Function: ~$25
- Apify: ~$100
- Copilot: ~$15
- **Total: ~$140/month**

---

## Timeline

**Week 1:**
- IT creates App Registration (Day 1)
- IT deploys Azure Function (Day 2-3)
- Dev builds static HTML with MSAL.js (Day 3-5)
- Test end-to-end (Day 5)

**Week 2:**
- Deploy to pilot hotel GM
- Monitor usage
- Gather feedback

**Week 3-4:**
- Scale to 10-20 hotels (if pilot successful)

---

## Questions for IT

1. **Azure OpenAI:** Do we have an existing Azure OpenAI deployment we can use?
   - **Preferred:** Deploy with Managed Identity (no API key management)
   - **Fallback:** API key approach if Managed Identity not approved

2. **Managed Identity Setup:** Can you enable System-Assigned Managed Identity on the Function App?
   - Grant "Cognitive Services OpenAI User" role to Function
   - Setup time: ~2 minutes (see [MANAGED-IDENTITY-GUIDE.md](./MANAGED-IDENTITY-GUIDE.md))

3. **CORS Policy:** Can you whitelist `*.sharepoint.com` for Azure Function CORS?

4. **Monitoring:** What logging/monitoring do you recommend? (Suggested: Application Insights)

5. **Rate Limiting:** Should we implement per-user rate limits? (Suggested: 10 requests/hour)

6. **Deployment Method:** Do you prefer:
   - Azure CLI deployment (we provide command)
   - VS Code deployment (we provide folder)
   - Azure DevOps pipeline (future consideration)

7. **Apify Account:** Who should own the Apify account?
   - Option A: IT team creates + manages
   - Option B: Marketing team creates, IT stores API key

---

## Documents Ready for Review

All documentation is ready in the GitHub repo:

1. **[IT-REQUIREMENTS.md](./IT-REQUIREMENTS.md)** - Detailed requirements
2. **[IT-DEPLOYMENT-CHECKLIST.md](./IT-DEPLOYMENT-CHECKLIST.md)** - Step-by-step deployment guide
3. **[MANAGED-IDENTITY-GUIDE.md](./MANAGED-IDENTITY-GUIDE.md)** - Managed Identity setup guide (30 min)
4. **[ARCHITECTURE-ONEDRIVE.md](./ARCHITECTURE-ONEDRIVE.md)** - Architecture diagrams
5. **[azure-functions/](./azure-functions/)** - Backend code ready to deploy
6. **[BUILD-STATIC-HTML.md](./BUILD-STATIC-HTML.md)** - Frontend build guide

---

## What Happens After This Meeting

**If approved today:**
1. IT provides Client ID + Tenant ID (email to dev team)
2. IT provisions Azure OpenAI endpoint with Managed Identity setup
3. Dev team builds static HTML with MSAL.js (2-3 days)
4. IT deploys Azure Function with Managed Identity enabled (1 hour)
5. End-to-end testing (1 day)
6. Pilot deployment (Week 2)

**If more time needed:**
- Dev team stands by for questions
- Can schedule follow-up call to demo prototype
- Can adjust timeline based on IT availability

---

## Success Criteria

**Technical:**
- Response time < 3 minutes for analysis
- Success rate > 95%
- No authentication errors
- Costs within budget

**Business:**
- Pilot GM satisfied (≥ 8/10 rating)
- Time saved vs manual: ≥ 30 min per hotel
- Results are actionable (clear next steps)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Azure Function timeout | Set 5-minute timeout, implement retry logic |
| Apify API downtime | Graceful error handling, manual fallback |
| API cost overrun | Set Apify spending alert at $100/month |
| Security concern | Managed Identity (no keys), token validation on every request |

---

## Support Contacts

**Dev Team:** [Your name/email]
**Apify Support:** support@apify.com
**Microsoft Support:** [Your enterprise support portal]

---

## Next Steps

After this meeting:
- [ ] IT confirms feasibility and timeline
- [ ] IT creates App Registration (Client ID + Tenant ID to dev)
- [ ] IT provisions Azure OpenAI endpoint with Managed Identity
- [ ] Dev integrates MSAL.js and builds static HTML
- [ ] Dev provides Azure Function code to IT
- [ ] IT deploys Azure Function with Managed Identity enabled
- [ ] Joint testing
- [ ] Pilot launch

---

**Meeting Document Version:** 1.0
**Prepared By:** Dev Team
**For Questions:** [Your email/Teams contact]
