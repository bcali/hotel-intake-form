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

### 1. Azure App Registration (30 minutes)
Create an App Registration for authentication:

- **Name:** `hotel-vog-poc`
- **Type:** Single tenant
- **Redirect URI:** `https://[tenant].sharepoint.com/*` (SPA type)
- **Permissions:** `User.Read` (delegated, with admin consent)

**Output needed:**
- Client ID (safe to expose in browser)
- Tenant ID (safe to expose in browser)

### 2. Azure Function App (1 hour)
Deploy serverless backend:

- **Name:** `hotel-vog-functions`
- **Runtime:** Node.js 20
- **Plan:** Consumption (pay-per-use)
- **Function Code:** We provide (Node.js code ready to deploy)
- **Environment Variables:**
  - `APIFY_API_TOKEN` (for review scraping)
  - `AZURE_OPENAI_ENDPOINT` (for AI analysis)
  - `AZURE_OPENAI_KEY` (for AI analysis)
  - `AZURE_OPENAI_DEPLOYMENT` (model name, e.g., `gpt-4o`)
  - `TENANT_ID` (from App Registration)
  - `CLIENT_ID` (from App Registration)

### 3. Azure OpenAI or Copilot Access
We need programmatic API access for AI analysis:

- **Option A:** Azure OpenAI deployment (gpt-4o model)
- **Option B:** Microsoft Copilot API endpoint

**What we need:**
- API endpoint URL
- API key

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
- API keys never exposed in browser (only in Azure Function)
- Only authenticated users can call Azure Function
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

1. **Azure OpenAI:** Do we have an existing Azure OpenAI deployment we can use, or should we use Copilot API?

2. **CORS Policy:** Can you whitelist `*.sharepoint.com` for Azure Function CORS?

3. **Monitoring:** What logging/monitoring do you recommend? (Suggested: Application Insights)

4. **Rate Limiting:** Should we implement per-user rate limits? (Suggested: 10 requests/hour)

5. **Deployment Method:** Do you prefer:
   - Azure CLI deployment (we provide command)
   - VS Code deployment (we provide folder)
   - Azure DevOps pipeline (future consideration)

6. **Apify Account:** Who should own the Apify account?
   - Option A: IT team creates + manages
   - Option B: Marketing team creates, IT stores API key

---

## Documents Ready for Review

All documentation is ready in the GitHub repo:

1. **[IT-REQUIREMENTS.md](./IT-REQUIREMENTS.md)** - Detailed requirements
2. **[IT-DEPLOYMENT-CHECKLIST.md](./IT-DEPLOYMENT-CHECKLIST.md)** - Step-by-step deployment guide
3. **[ARCHITECTURE-ONEDRIVE.md](./ARCHITECTURE-ONEDRIVE.md)** - Architecture diagrams
4. **[azure-functions/](./azure-functions/)** - Backend code ready to deploy
5. **[BUILD-STATIC-HTML.md](./BUILD-STATIC-HTML.md)** - Frontend build guide

---

## What Happens After This Meeting

**If approved today:**
1. IT provides Client ID + Tenant ID (email to dev team)
2. IT provisions Azure OpenAI or Copilot API credentials
3. Dev team begins MSAL.js integration (2-3 days)
4. IT deploys Azure Function when code ready (1 hour)
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
| Security concern | All API keys server-side only, token validation on every request |

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
- [ ] IT provides Azure OpenAI/Copilot credentials
- [ ] Dev integrates MSAL.js and builds static HTML
- [ ] Dev provides Azure Function code to IT
- [ ] IT deploys Azure Function
- [ ] Joint testing
- [ ] Pilot launch

---

**Meeting Document Version:** 1.0
**Prepared By:** Dev Team
**For Questions:** [Your email/Teams contact]
