# IT Deployment Checklist

**Hotel Voice of Guest - POC Deployment**

---

## Pre-Deployment (Before Meeting)

### IT Team Preparation

- [ ] **Review IT Requirements Document**
  - Read [IT-REQUIREMENTS.md](./IT-REQUIREMENTS.md)
  - Review architecture diagram in [ARCHITECTURE-ONEDRIVE.md](./ARCHITECTURE-ONEDRIVE.md)
  - Confirm feasibility and timeline

- [ ] **Verify Access & Permissions**
  - [ ] Access to Azure Portal (Contributor role)
  - [ ] Access to Azure AD Admin Center
  - [ ] Permission to create App Registrations
  - [ ] Permission to create Azure Functions
  - [ ] Permission to configure SharePoint/OneDrive settings

- [ ] **Prepare Accounts**
  - [ ] Apify account (or confirm budget for $49/month plan)
  - [ ] Azure OpenAI access (or Copilot API endpoint)

---

## Phase 1: Azure App Registration (30 minutes)

### Step 1: Create App Registration

- [ ] **Navigate to Azure AD Admin Center**
  - URL: https://aad.portal.azure.com/
  - Go to: Azure Active Directory → App registrations → New registration

- [ ] **Configure Registration**
  - **Name:** `hotel-vog-poc`
  - **Supported account types:** Single tenant
  - **Redirect URI:**
    - Type: Single-page application (SPA)
    - URI: `https://[tenant].sharepoint.com/sites/HotelVoGPOC`
    - Add wildcard: `https://[tenant]-my.sharepoint.com/*`
  - Click "Register"

### Step 2: Configure API Permissions

- [ ] **Add Microsoft Graph Permissions**
  - Go to: API permissions → Add a permission
  - Select: Microsoft Graph → Delegated permissions
  - Add: `User.Read`
  - Click "Add permissions"
  - Click "Grant admin consent" (requires admin)

### Step 3: Record Credentials

- [ ] **Copy Application (client) ID**
  - Example: `a1b2c3d4-e5f6-7890-abcd-1234567890ab`
  - Save to: Secure notes or password manager

- [ ] **Copy Directory (tenant) ID**
  - Example: `12345678-90ab-cdef-1234-567890abcdef`
  - Save to: Secure notes or password manager

- [ ] **Share with Dev Team**
  - Email Client ID + Tenant ID to dev team
  - **Note:** These IDs are safe to expose in browser code

---

## Phase 2: Azure Function App (45 minutes)

### Step 1: Create Function App

- [ ] **Navigate to Azure Portal**
  - URL: https://portal.azure.com/
  - Go to: Create a resource → Function App

- [ ] **Configure Basics**
  - **Subscription:** [Your subscription]
  - **Resource Group:** Create new: `hotel-vog-rg`
  - **Function App name:** `hotel-vog-functions` (must be globally unique)
  - **Runtime stack:** Node.js
  - **Version:** 20 LTS
  - **Region:** Same as your tenant (e.g., East US)
  - **Operating System:** Linux
  - **Plan type:** Consumption (Serverless)

- [ ] **Configure Storage**
  - **Storage account:** Create new: `hotelvogstg[random]`
  - **Account type:** Standard (LRS)

- [ ] **Configure Networking**
  - **Enable public access:** Yes
  - **Network injection:** Off (not needed for POC)

- [ ] **Configure Monitoring**
  - **Application Insights:** Yes
  - **Region:** Same as Function App

- [ ] **Review + Create**
  - Review settings
  - Click "Create"
  - Wait for deployment (2-3 minutes)

### Step 2: Configure CORS

- [ ] **Navigate to Function App**
  - Go to: Settings → CORS

- [ ] **Add Allowed Origins**
  - Add: `https://[tenant].sharepoint.com`
  - Add: `https://[tenant]-my.sharepoint.com`
  - **Remove:** `*` (if present - too permissive)
  - Click "Save"

### Step 3: Configure Environment Variables

- [ ] **Navigate to Configuration**
  - Go to: Settings → Configuration → Application settings

- [ ] **Add Apify Settings**
  - Click "New application setting"
  - **Name:** `APIFY_API_TOKEN`
  - **Value:** `apify_api_xxxxxxxxxxxxx` (from Apify account)
  - Click "OK"

- [ ] **Add Azure OpenAI Settings**
  - **Name:** `AZURE_OPENAI_ENDPOINT`
  - **Value:** `https://[resource].openai.azure.com/`
  - Click "OK"

  - **Name:** `AZURE_OPENAI_KEY`
  - **Value:** `xxxxxxxxxxxxx`
  - Click "OK"

  - **Name:** `AZURE_OPENAI_DEPLOYMENT`
  - **Value:** `gpt-4o` (or your Copilot deployment name)
  - Click "OK"

- [ ] **Add Auth Settings**
  - **Name:** `TENANT_ID`
  - **Value:** [Tenant ID from App Registration]
  - Click "OK"

  - **Name:** `CLIENT_ID`
  - **Value:** [Client ID from App Registration]
  - Click "OK"

- [ ] **Save Configuration**
  - Click "Save" at top of page
  - Wait for restart (30 seconds)

### Step 4: Deploy Function Code

**Option A: Using Azure CLI (Recommended)**

```bash
# 1. Login to Azure
az login

# 2. Navigate to function code folder
cd hotel-intake-form/azure-functions

# 3. Install dependencies
npm install

# 4. Deploy to Azure
func azure functionapp publish hotel-vog-functions
```

**Option B: Using VS Code**

- [ ] Open `hotel-intake-form/azure-functions` in VS Code
- [ ] Install Azure Functions extension
- [ ] Click Azure icon in sidebar
- [ ] Right-click on function app name
- [ ] Select "Deploy to Function App"
- [ ] Follow prompts

**Option C: Using Azure Portal (Zip Deploy)**

- [ ] Navigate to Function App
- [ ] Go to: Deployment → Deployment Center
- [ ] Select "External Git" or "Local Git"
- [ ] Upload `azure-functions.zip` provided by dev team

- [ ] **Verify Deployment**
  - Go to: Functions → fetch-and-analyze
  - Click "Code + Test"
  - Confirm code is present
  - Click "Test/Run" to verify it loads

---

## Phase 3: Apify Account Setup (15 minutes)

### Step 1: Create Apify Account

- [ ] **Sign Up**
  - URL: https://apify.com/
  - Click "Start for free"
  - Use company email
  - Verify email

- [ ] **Choose Plan**
  - **Free Tier:** $5 credit (for testing only)
  - **Starter Plan:** $49/month (for production)
  - Recommendation: Start with free tier for pilot

### Step 2: Get API Token

- [ ] **Navigate to Settings**
  - Go to: https://console.apify.com/
  - Click user icon → Settings → Integrations

- [ ] **Create API Token**
  - Click "Create new token"
  - Name: `hotel-vog-poc`
  - Click "Create"
  - **Copy token** (starts with `apify_api_`)

- [ ] **Add to Azure Function**
  - Already added in Phase 2, Step 3
  - If not, add now as `APIFY_API_TOKEN`

### Step 3: Test Actors

- [ ] **Test Google Maps Scraper**
  - Go to: https://apify.com/compass/google-maps-scraper
  - Click "Try for free"
  - Enter sample hotel URL
  - Set `maxReviews: 10`
  - Click "Start"
  - Verify results download

- [ ] **Test TripAdvisor Scraper**
  - Go to: https://apify.com/maxcopell/tripadvisor
  - Click "Try for free"
  - Enter sample hotel URL
  - Set `maxItems: 10`
  - Click "Start"
  - Verify results download

- [ ] **Test Booking Scraper**
  - Go to: https://apify.com/voyager/booking-scraper
  - Click "Try for free"
  - Enter sample hotel URL
  - Set `maxReviews: 10`
  - Click "Start"
  - Verify results download

---

## Phase 4: Azure OpenAI / Copilot Setup (15 minutes)

**Option A: Azure OpenAI (Recommended)**

- [ ] **Create Azure OpenAI Resource**
  - Go to: Azure Portal → Create a resource
  - Search: "Azure OpenAI"
  - Click "Create"
  - **Region:** East US (or region with GPT-4o availability)
  - **Pricing tier:** Standard S0
  - Click "Create"

- [ ] **Deploy GPT-4o Model**
  - Go to: Azure OpenAI Studio (https://oai.azure.com/)
  - Navigate to: Deployments → Create new deployment
  - **Model:** gpt-4o
  - **Deployment name:** `gpt-4o`
  - **Version:** Latest
  - Click "Create"

- [ ] **Get Credentials**
  - Go to: Azure Portal → Your OpenAI resource
  - Navigate to: Keys and Endpoint
  - **Copy Endpoint:** `https://[resource].openai.azure.com/`
  - **Copy Key 1:** `xxxxxxxxxxxxx`
  - Add to Azure Function config (already done in Phase 2)

**Option B: Microsoft Copilot API**

- [ ] **Contact Microsoft Rep**
  - Request Copilot API access for programmatic use
  - Get API endpoint URL
  - Get API key

- [ ] **Add to Azure Function**
  - Use endpoint as `AZURE_OPENAI_ENDPOINT`
  - Use key as `AZURE_OPENAI_KEY`
  - Use deployment name as `AZURE_OPENAI_DEPLOYMENT`

---

## Phase 5: Testing (30 minutes)

### Step 1: Test Azure Function Directly

- [ ] **Get Function URL**
  - Go to: Function App → fetch-and-analyze
  - Click "Get Function URL"
  - Copy URL (e.g., `https://hotel-vog-functions.azurewebsites.net/api/fetch-and-analyze`)

- [ ] **Test with Postman or curl**

Create `test-payload.json`:
```json
{
  "hotelName": "Test Hotel",
  "timePeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-20"
  },
  "reviewSources": {
    "googleMaps": "https://www.google.com/maps/place/...valid-url..."
  }
}
```

Run curl:
```bash
curl -X POST https://hotel-vog-functions.azurewebsites.net/api/fetch-and-analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [get-token-from-jwt.ms]" \
  -d @test-payload.json
```

**To get a test token:**
- Go to: https://jwt.ms/
- Sign in with Microsoft account
- Copy token
- Use in Authorization header

- [ ] **Verify Response**
  - Status: 200 OK
  - Body contains: `{ "success": true, "analysis": {...}, ... }`
  - No errors in response

- [ ] **Check Logs**
  - Go to: Function App → Log stream
  - Verify execution logs appear
  - Confirm no errors

### Step 2: Test End-to-End with Dev Team

- [ ] **Dev Team Deploys Static HTML**
  - Dev builds React app with MSAL.js integration
  - Dev uploads to test OneDrive folder
  - Dev shares link with IT

- [ ] **IT Tests Full Flow**
  - Open HTML link in browser
  - Click "Sign In" (MSAL.js popup)
  - Sign in with Microsoft account
  - Fill form with test hotel
  - Submit form
  - Verify dashboard displays results
  - Check Azure Function logs

- [ ] **Verify Results**
  - Analysis displayed in dashboard
  - No console errors in browser
  - No 401/500 errors
  - Response time < 3 minutes

---

## Phase 6: Pilot Deployment (1 hour)

### Step 1: Create OneDrive Folder Structure

- [ ] **Create SharePoint Site or OneDrive Folder**
  - Option A: SharePoint site: `https://[tenant].sharepoint.com/sites/HotelVoGPOC`
  - Option B: OneDrive folder: Create "Hotel VoG POC" in your OneDrive

- [ ] **Create First Hotel Folder**
  - Create folder: `anantara-siam/`
  - Upload static HTML files (from dev team build)
  - Upload `README.txt` with instructions

- [ ] **Set Permissions**
  - Share folder with pilot hotel GM
  - Permission: "Can view"
  - Send email with link + instructions

### Step 2: GM Training

- [ ] **Schedule 15-Min Training Call**
  - Show how to open `index.html`
  - Show how to sign in
  - Walk through form submission
  - Show dashboard results

- [ ] **Provide Support Contact**
  - Email: [your-email]
  - Teams: [your-teams-handle]
  - Availability: 9am-5pm

### Step 3: Monitor Pilot

- [ ] **Track Usage**
  - Check Azure Function logs daily
  - Monitor Apify usage/costs
  - Monitor Copilot API usage/costs

- [ ] **Gather Feedback**
  - Email GM after 1 week
  - Ask: What worked? What didn't?
  - Iterate based on feedback

---

## Phase 7: Scale to Production (Week 3-4)

### Step 1: Create Folders for All Hotels

- [ ] **Batch Create Folders**
  - Create folder for each hotel (10-20 hotels)
  - Upload static HTML to each
  - Customize README.txt with hotel-specific instructions

### Step 2: Distribute Access

- [ ] **Share Links**
  - Email each GM with their folder link
  - Include instructions + support contact
  - Schedule optional training calls

### Step 3: Monitor at Scale

- [ ] **Set Up Alerts**
  - Azure Function error rate > 5%
  - Apify spending > $100/month
  - Copilot API rate limiting

- [ ] **Weekly Review**
  - Check usage metrics
  - Review costs
  - Gather feedback from GMs

---

## Security Checklist

- [ ] **App Registration Security**
  - [ ] Redirect URIs limited to SharePoint/OneDrive
  - [ ] No public client flows enabled
  - [ ] Admin consent granted for API permissions

- [ ] **Azure Function Security**
  - [ ] CORS limited to SharePoint/OneDrive domains
  - [ ] Environment variables not exposed in code
  - [ ] HTTPS enforced (default for Azure Functions)
  - [ ] Authentication level set to "anonymous" (validates token in code)

- [ ] **API Key Security**
  - [ ] Apify token stored in Azure Function env vars only
  - [ ] Copilot API key stored in Azure Function env vars only
  - [ ] No keys in browser code or HTML files
  - [ ] Keys rotated every 90 days (set reminder)

- [ ] **Data Privacy**
  - [ ] No PII logged in Azure Function
  - [ ] Review content not persisted (stateless processing)
  - [ ] Logs retained for 30 days only

---

## Rollback Plan

If issues arise during deployment:

- [ ] **Azure Function Issues**
  - Revert to previous deployment slot
  - Fallback: Disable function, use manual workflow

- [ ] **Authentication Issues**
  - Check App Registration redirect URIs
  - Verify Client ID + Tenant ID in HTML config
  - Test token with https://jwt.ms/

- [ ] **API Issues**
  - Apify: Check account balance and rate limits
  - Copilot: Check quota and deployment status

---

## Success Criteria

Before marking deployment complete:

- [ ] **Technical**
  - [ ] Azure Function responds < 3 min (P95)
  - [ ] Success rate > 95%
  - [ ] No authentication errors
  - [ ] Costs within budget ($5-10 for pilot)

- [ ] **User Experience**
  - [ ] GM can complete form without help
  - [ ] Dashboard displays readable results
  - [ ] No browser errors or crashes

- [ ] **Business**
  - [ ] Pilot GM satisfied with results (≥ 8/10 rating)
  - [ ] Results actionable (clear next steps)
  - [ ] Time savings vs manual (≥ 30 min)

---

## Support Contacts

**Dev Team:** [Your name/email]
**IT Lead:** [IT contact]
**Apify Support:** support@apify.com
**Microsoft Support:** [Enterprise support portal]

---

## Post-Deployment

### Week 1
- [ ] Monitor daily usage
- [ ] Check for errors in logs
- [ ] Respond to GM questions within 4 hours

### Week 2
- [ ] Review cost actuals vs estimates
- [ ] Gather GM feedback (survey)
- [ ] Plan iteration/improvements

### Week 3-4
- [ ] Scale to 10-20 hotels
- [ ] Continue monitoring
- [ ] Prepare business case for production

---

**Checklist Version:** 1.0
**Last Updated:** 2026-01-21
**Prepared By:** Dev Team
**Review With:** IT Team Lead
