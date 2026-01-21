# Managed Identity Setup Guide

**For IT Team: Secure Azure OpenAI Authentication Without API Keys**

---

## What is Managed Identity?

Managed Identity is Azure's built-in authentication system that **eliminates the need for API keys**. Instead of storing secrets, Azure automatically manages credentials for services to communicate with each other.

**Benefits:**
- ✅ No API keys to manage or rotate
- ✅ No secrets stored in code or environment variables
- ✅ Automatic credential rotation by Azure
- ✅ Better security posture
- ✅ Easier compliance (SOC2, ISO27001)
- ✅ Recommended by Microsoft for production workloads

---

## Setup Overview (30 minutes)

You'll complete these steps:
1. Create Azure Function App (10 min)
2. Enable Managed Identity on Function (1 min)
3. Grant Function access to Azure OpenAI (2 min)
4. Deploy function code (5 min)
5. Test end-to-end (5 min)

---

## Step-by-Step Instructions

### Step 1: Create Azure Function App

**Prerequisites:**
- Azure subscription with Contributor access
- Azure OpenAI resource already created

**Create Function App:**

```bash
# Option A: Using Azure Portal
1. Go to: https://portal.azure.com/
2. Click: Create a resource → Function App
3. Configure:
   - Subscription: [Your subscription]
   - Resource Group: hotel-vog-rg (create new if needed)
   - Function App name: hotel-vog-functions (must be globally unique)
   - Runtime stack: Node.js
   - Version: 20 LTS
   - Region: Same as Azure OpenAI (e.g., East US)
   - Operating System: Linux
   - Plan type: Consumption (Serverless)
4. Click: Review + Create → Create
5. Wait 2-3 minutes for deployment
```

**Or using Azure CLI:**

```bash
az login

# Create resource group
az group create --name hotel-vog-rg --location eastus

# Create storage account (required for Function App)
az storage account create \
  --name hotelvogstg$(date +%s) \
  --resource-group hotel-vog-rg \
  --location eastus \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --resource-group hotel-vog-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name hotel-vog-functions \
  --storage-account hotelvogstg[timestamp]
```

---

### Step 2: Enable Managed Identity (1 minute)

**Option A: Azure Portal**

1. Go to: Azure Portal → Function App → hotel-vog-functions
2. Click: Settings → Identity
3. Under "System assigned" tab:
   - Toggle Status to **On**
   - Click **Save**
   - Click **Yes** to confirm
4. **Copy the Object (principal) ID** that appears (you'll need this)
   - Example: `abc12345-def6-7890-ghij-klmnopqrstuv`

**Option B: Azure CLI**

```bash
# Enable system-assigned managed identity
az functionapp identity assign \
  --name hotel-vog-functions \
  --resource-group hotel-vog-rg

# Output will show:
# {
#   "principalId": "abc12345-def6-7890-ghij-klmnopqrstuv",
#   "tenantId": "...",
#   "type": "SystemAssigned"
# }

# Copy the principalId for next step
```

---

### Step 3: Grant Function Access to Azure OpenAI (2 minutes)

Now give your Function App permission to call Azure OpenAI.

**Option A: Azure Portal**

1. Go to: Azure OpenAI resource
2. Click: Access control (IAM) on left sidebar
3. Click: + Add → Add role assignment
4. On "Role" tab:
   - Search for: **Cognitive Services OpenAI User**
   - Select it
   - Click **Next**
5. On "Members" tab:
   - Assign access to: **Managed Identity**
   - Click: + Select members
   - Filter by: Function App
   - Select: hotel-vog-functions
   - Click **Select**
   - Click **Next**
6. On "Review + assign" tab:
   - Click **Review + assign**
7. Done! Wait 30 seconds for permissions to propagate

**Option B: Azure CLI**

```bash
# Get the Azure OpenAI resource ID
OPENAI_RESOURCE_ID=$(az cognitiveservices account show \
  --name your-openai-resource-name \
  --resource-group your-openai-rg \
  --query id -o tsv)

# Get the Function App's principal ID
FUNCTION_PRINCIPAL_ID=$(az functionapp identity show \
  --name hotel-vog-functions \
  --resource-group hotel-vog-rg \
  --query principalId -o tsv)

# Assign the role
az role assignment create \
  --assignee $FUNCTION_PRINCIPAL_ID \
  --role "Cognitive Services OpenAI User" \
  --scope $OPENAI_RESOURCE_ID

# Success message:
# {
#   "roleDefinitionName": "Cognitive Services OpenAI User",
#   ...
# }
```

---

### Step 4: Configure Environment Variables

**What to configure:**
- Apify API token (still needed - it's a 3rd party)
- Azure OpenAI endpoint URL
- Azure OpenAI deployment name
- Tenant ID + Client ID (for user authentication)

**Note:** We do NOT configure AZURE_OPENAI_KEY - Managed Identity handles that!

**Option A: Azure Portal**

1. Go to: Function App → Settings → Configuration
2. Click: + New application setting
3. Add these settings (one by one):

| Name | Value | Notes |
|------|-------|-------|
| `APIFY_API_TOKEN` | `apify_api_xxxxx` | From Apify account |
| `AZURE_OPENAI_ENDPOINT` | `https://[resource].openai.azure.com/` | Your OpenAI endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4o` | Your deployment name |
| `TENANT_ID` | `xxxxxxxx-xxxx-...` | From App Registration |
| `CLIENT_ID` | `xxxxxxxx-xxxx-...` | From App Registration |

4. Click **Save** at top
5. Click **Continue** to restart function

**Option B: Azure CLI**

```bash
az functionapp config appsettings set \
  --name hotel-vog-functions \
  --resource-group hotel-vog-rg \
  --settings \
    "APIFY_API_TOKEN=apify_api_xxxxx" \
    "AZURE_OPENAI_ENDPOINT=https://[resource].openai.azure.com/" \
    "AZURE_OPENAI_DEPLOYMENT=gpt-4o" \
    "TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" \
    "CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Notice:** No AZURE_OPENAI_KEY - that's the whole point! 🎉

---

### Step 5: Deploy Function Code

**The function code is already updated to use Managed Identity.**

Located in: `azure-functions/fetch-and-analyze/`

**Option A: Using VS Code**

1. Install Azure Functions extension in VS Code
2. Open `azure-functions/` folder
3. Right-click on folder → Deploy to Function App
4. Select: hotel-vog-functions
5. Confirm deployment
6. Wait 1-2 minutes

**Option B: Using Azure Functions Core Tools**

```bash
cd azure-functions

# Install dependencies
npm install

# Deploy to Azure
func azure functionapp publish hotel-vog-functions
```

**Option C: Using Azure CLI (zip deploy)**

```bash
cd azure-functions

# Install dependencies
npm install

# Create zip file (excluding node_modules if deploying from Linux/Mac)
zip -r function.zip . -x "node_modules/*"

# Deploy
az functionapp deployment source config-zip \
  --resource-group hotel-vog-rg \
  --name hotel-vog-functions \
  --src function.zip
```

---

### Step 6: Test the Setup

**Test Managed Identity Connection:**

1. Go to: Function App → Functions → fetch-and-analyze
2. Click: Code + Test
3. Click: Test/Run
4. Input tab:
   - HTTP Method: POST
   - Add header: `Content-Type` = `application/json`
   - Body:
     ```json
     {
       "hotelName": "Test Hotel",
       "timePeriod": {"startDate": "2026-01-01", "endDate": "2026-01-20"},
       "reviewSources": {
         "googleMaps": "https://www.google.com/maps/place/[valid-url]"
       }
     }
     ```
5. Click: Run
6. Check Output tab for results
7. Check Logs tab for any errors

**Expected Success:**
- Status: 200 OK (if you provided valid bearer token)
- Or 401 Unauthorized (expected without token - means auth is working)

**Check Logs for Managed Identity:**
- Should see: "Analyzing reviews with Copilot..."
- Should NOT see: "API key error" or "authentication failed"

---

## Troubleshooting

### Error: "DefaultAzureCredential failed to retrieve token"

**Cause:** Managed Identity not enabled or not granted permissions

**Fix:**
```bash
# 1. Verify Managed Identity is enabled
az functionapp identity show \
  --name hotel-vog-functions \
  --resource-group hotel-vog-rg

# Should show: "type": "SystemAssigned"

# 2. Verify role assignment
az role assignment list \
  --assignee [principal-id-from-above] \
  --all

# Should show: "Cognitive Services OpenAI User"
```

### Error: "AADSTS700016: Application not found"

**Cause:** CLIENT_ID or TENANT_ID incorrect in environment variables

**Fix:**
- Double-check values in App Registration
- Update Function App settings with correct IDs

### Error: "Resource not found" when calling OpenAI

**Cause:** AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_DEPLOYMENT incorrect

**Fix:**
```bash
# Get correct endpoint
az cognitiveservices account show \
  --name your-openai-resource \
  --resource-group your-openai-rg \
  --query properties.endpoint -o tsv

# List deployments
az cognitiveservices account deployment list \
  --name your-openai-resource \
  --resource-group your-openai-rg
```

---

## Security Checklist

After setup, verify:

- [ ] Managed Identity is enabled (green toggle in Portal)
- [ ] Function has "Cognitive Services OpenAI User" role
- [ ] No AZURE_OPENAI_KEY in environment variables
- [ ] APIFY_API_TOKEN is set (this one is still needed)
- [ ] Function successfully calls Azure OpenAI
- [ ] Logs show no authentication errors

---

## Comparison: Before vs After

### Before (API Key Approach)

**Environment Variables:**
```
APIFY_API_TOKEN=xxx
AZURE_OPENAI_ENDPOINT=https://...
AZURE_OPENAI_KEY=xxxxxxxxxxxxx  ← Secret to manage
AZURE_OPENAI_DEPLOYMENT=gpt-4o
TENANT_ID=xxx
CLIENT_ID=xxx
```

**Code:**
```javascript
const client = new OpenAIClient(
  endpoint,
  new AzureKeyCredential(AZURE_OPENAI_KEY) // ← Requires API key
);
```

**Maintenance:**
- Rotate API key every 90 days
- Update Function settings when rotated
- Track who has access to key

---

### After (Managed Identity)

**Environment Variables:**
```
APIFY_API_TOKEN=xxx
AZURE_OPENAI_ENDPOINT=https://...
AZURE_OPENAI_DEPLOYMENT=gpt-4o
TENANT_ID=xxx
CLIENT_ID=xxx
```

**Code:**
```javascript
const credential = new DefaultAzureCredential();
const client = new OpenAIClient(endpoint, credential); // ← No key!
```

**Maintenance:**
- No key rotation needed
- Azure handles credentials automatically
- Revoke access by removing IAM role assignment

---

## Benefits Summary

| Aspect | API Key | Managed Identity |
|--------|---------|------------------|
| **Setup time** | 30 min | 29 min (faster!) |
| **Secrets to manage** | 2 (Apify + OpenAI) | 1 (Apify only) |
| **Key rotation** | Every 90 days | Never |
| **Security** | Medium (key can leak) | High (no keys) |
| **Compliance** | Requires manual tracking | Auto-audited by Azure |
| **Recommended by MS** | No | Yes ✅ |

---

## Next Steps

After successful setup:

1. ✅ Test with real hotel data
2. ✅ Monitor Function logs for issues
3. ✅ Set up Application Insights for monitoring
4. ✅ Deploy to pilot hotel
5. ✅ Scale to 10-20 hotels

---

**Support:**
- Azure Managed Identity docs: https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/
- Azure OpenAI authentication: https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/managed-identity

**Version:** 1.0
**Last Updated:** 2026-01-21
**Maintained By:** Dev Team + IT Team
