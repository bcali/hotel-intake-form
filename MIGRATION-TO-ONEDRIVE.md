# Migration to OneDrive + Azure Functions

**Status:** In Progress
**Target:** Production POC with real-time analysis

---

## Completed ✅

### Documentation
- [x] [IT-REQUIREMENTS.md](./IT-REQUIREMENTS.md) - Complete requirements for IT team
- [x] [IT-DEPLOYMENT-CHECKLIST.md](./IT-DEPLOYMENT-CHECKLIST.md) - Step-by-step deployment
- [x] [ARCHITECTURE-ONEDRIVE.md](./ARCHITECTURE-ONEDRIVE.md) - Architecture diagrams
- [x] [BUILD-STATIC-HTML.md](./BUILD-STATIC-HTML.md) - Build process
- [x] [IT-MEETING-SUMMARY.md](./IT-MEETING-SUMMARY.md) - Meeting prep
- [x] [PRD.md](./PRD.md) - Updated to reflect OneDrive + Copilot approach

### Backend (Azure Functions)
- [x] `/azure-functions/fetch-and-analyze/index.js` - Main function with auth validation
- [x] `/azure-functions/fetch-and-analyze/function.json` - Function config
- [x] `/azure-functions/package.json` - Dependencies
- [x] `/azure-functions/host.json` - Host config
- [x] `/azure-functions/README.md` - Deployment guide

### Frontend (Code)
- [x] `/src/config/msal-config.ts` - MSAL configuration
- [x] `/src/services/api.ts` - API service layer
- [x] `/src/components/login-screen.tsx` - Login UI
- [x] `/src/App-with-MSAL.tsx` - MSAL-integrated app (NEW VERSION)

### Dependencies
- [x] `@azure/msal-browser` installed
- [x] `@azure/msal-react` installed

---

## Remaining Work 🔄

### 1. Integrate New App.tsx (10 minutes)

**Current Status:**
- Old `src/App.tsx` - Localhost mode with JSON download
- New `src/App-with-MSAL.tsx` - MSAL authentication + API integration

**Action:**
```bash
# Backup old version
mv src/App.tsx src/App-localhost-backup.tsx

# Activate new version
mv src/App-with-MSAL.tsx src/App.tsx
```

**Why keeping backup:**
- May want to reference localhost logic
- Useful for testing without Azure setup

### 2. Update Dashboard Component (30 minutes)

**Current:** Mock data hardcoded

**Needed:** Accept real API data

**Changes Required:**

**File:** `src/components/dashboard.tsx`

**Props to Add:**
```typescript
interface DashboardProps {
  analysisData: FetchAndAnalyzeResponse; // From API
  formData: FormData; // Existing
  onStartNew: () => void; // New analysis
  onLogout: () => void; // Sign out
  userEmail: string; // Display user
}
```

**Replace Mock Data With:**
```typescript
// Instead of hardcoded:
const sentimentScore = 78;

// Use API data:
const sentimentScore = analysisData.analysis.sentiment.overall;
```

**Sections to Update:**
- KPI cards (use real sentiment, total reviews)
- Positive themes (use `analysis.topPositiveThemes`)
- Negative themes (use `analysis.topNegativeThemes`)
- Action items (use `analysis.actionItems`)
- Executive summary (use `analysis.executiveSummary`)

### 3. Update SocialStep Component (5 minutes)

**File:** `src/components/social-step.tsx`

**Add prop:** `isSubmitting: boolean`

**Update Submit Button:**
```typescript
<button
  onClick={onSubmit}
  disabled={isSubmitting}
  className={...}
>
  {isSubmitting ? (
    <>
      <Loader className="w-5 h-5 animate-spin" />
      Analyzing...
    </>
  ) : (
    <>
      <Send className="w-5 h-5" />
      Submit & Analyze
    </>
  )}
</button>
```

### 4. Environment Setup (5 minutes)

**For Local Development:**

Create `.env.local`:
```
VITE_AZURE_CLIENT_ID=your-client-id-from-IT
VITE_AZURE_TENANT_ID=your-tenant-id-from-IT
VITE_AZURE_FUNCTION_URL=http://localhost:7071
```

**For Production Build:**

Use `scripts/inject-config.js` (already created):
```bash
npm run build
node scripts/inject-config.js \
  "client-id" \
  "tenant-id" \
  "https://hotel-vog-functions.azurewebsites.net"
```

### 5. Update Build Scripts (5 minutes)

**File:** `package.json`

**Add script:**
```json
{
  "scripts": {
    "build:onedrive": "vite build && node scripts/inject-config.js"
  }
}
```

**Create:** `scripts/inject-config.js` (see [BUILD-STATIC-HTML.md](./BUILD-STATIC-HTML.md))

### 6. Remove Localhost-Only Features (10 minutes)

**Files to Clean:**
- Remove localhost banner from old App.tsx (already removed in new version)
- Remove JSON download logic from old App.tsx (already removed in new version)
- Remove `src/components/confirmation-screen.tsx` (replaced by Dashboard)

**Optional:** Keep for backward compatibility testing

---

## Testing Plan

### Local Development Testing (With IT-Provided Credentials)

1. **Set up environment:**
   ```bash
   # Create .env.local
   echo "VITE_AZURE_CLIENT_ID=xxx" >> .env.local
   echo "VITE_AZURE_TENANT_ID=xxx" >> .env.local
   echo "VITE_AZURE_FUNCTION_URL=http://localhost:7071" >> .env.local
   ```

2. **Run Azure Function locally:**
   ```bash
   cd azure-functions
   npm install
   func start
   ```

3. **Run React app:**
   ```bash
   npm run dev
   ```

4. **Test flow:**
   - Open http://localhost:5173/hotel-intake-form/
   - Click "Sign In with Microsoft"
   - Complete 4-step form
   - Submit
   - Verify API call to localhost:7071
   - Verify dashboard displays

### Production Testing (OneDrive Deployment)

1. **Build static HTML:**
   ```bash
   npm run build:onedrive
   ```

2. **Upload to OneDrive:**
   - Create folder: `Hotel VoG POC/test-hotel/`
   - Upload `dist/` contents
   - Share with test user

3. **Test flow:**
   - Open `index.html` from OneDrive
   - Sign in with Microsoft
   - Complete form
   - Submit
   - Verify Azure Function call
   - Verify dashboard

---

## Deployment Checklist

### Prerequisites (From IT Team)
- [ ] Azure App Registration created
  - [ ] Client ID received
  - [ ] Tenant ID received
- [ ] Azure Function deployed
  - [ ] Function URL received
  - [ ] Environment variables configured
- [ ] Apify API token configured in Azure Function
- [ ] Azure OpenAI credentials configured in Azure Function

### Build & Deploy
- [ ] Update `.env.local` with credentials (local testing)
- [ ] Build: `npm run build:onedrive`
- [ ] Verify `dist/index.html` contains injected config
- [ ] Upload `dist/` to OneDrive folder
- [ ] Share folder with pilot hotel GM
- [ ] Test end-to-end flow

---

## Rollback Plan

If issues arise:

1. **Revert to Localhost Mode:**
   ```bash
   mv src/App.tsx src/App-with-MSAL-broken.tsx
   mv src/App-localhost-backup.tsx src/App.tsx
   npm run dev
   ```

2. **Issues to Watch:**
   - MSAL popup blocked by browser → Add exception
   - CORS errors → Verify Azure Function CORS settings
   - 401 errors → Verify Client ID + Tenant ID match
   - Token validation failed → Check Azure Function env vars

---

## Next Steps

**After IT Meeting:**
1. Receive credentials (Client ID, Tenant ID, Function URL)
2. Complete remaining work (1-2 hours)
3. Test locally with Azure Function
4. Build static HTML
5. Deploy to OneDrive pilot folder
6. Test with pilot GM

**Timeline:**
- Code completion: 1-2 hours
- IT setup: 1 week (IT team work)
- Testing: 2-3 days
- Pilot launch: Week 2

---

**Document Version:** 1.0
**Last Updated:** 2026-01-21
**Owner:** Dev Team
