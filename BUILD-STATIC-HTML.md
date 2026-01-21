# Build Static HTML for OneDrive Deployment

**Converting React App to OneDrive-Compatible Static Files**

---

## Overview

This guide shows how to build the React app into static HTML files that can be hosted on OneDrive and integrate with Azure Functions backend.

---

## Prerequisites

- Node.js 20+
- npm installed
- Git repository cloned
- Azure Function URL (from IT team)
- Client ID + Tenant ID (from IT team)

---

## Build Process

### Step 1: Update Configuration

Edit `vite.config.ts` to configure build output:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for OneDrive
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined // Single JS file for simplicity
      }
    }
  }
});
```

### Step 2: Create MSAL Configuration File

Create `src/msal-config.ts`:

```typescript
import { Configuration } from '@azure/msal-browser';

// These will be injected at build time or loaded from window object
export const msalConfig: Configuration = {
  auth: {
    clientId: window.AZURE_CONFIG?.clientId || 'REPLACE_WITH_CLIENT_ID',
    authority: `https://login.microsoftonline.com/${window.AZURE_CONFIG?.tenantId || 'REPLACE_WITH_TENANT_ID'}`,
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ['User.Read']
};

// Azure Function endpoint
export const API_CONFIG = {
  functionUrl: window.AZURE_CONFIG?.functionUrl || 'REPLACE_WITH_FUNCTION_URL'
};

// Extend Window interface
declare global {
  interface Window {
    AZURE_CONFIG?: {
      clientId: string;
      tenantId: string;
      functionUrl: string;
    };
  }
}
```

### Step 3: Install MSAL Library

```bash
npm install @azure/msal-browser @azure/msal-react
```

### Step 4: Update App.tsx to Use MSAL

Modify `src/App.tsx`:

```typescript
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, API_CONFIG } from './msal-config';
import { useState } from 'react';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <MainApp />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginScreen />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

function LoginScreen() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error('Login failed:', e);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Hotel Voice of Guest</h2>
          <p className="mt-2 text-gray-600">Sign in with your Microsoft account</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Sign In with Microsoft
        </button>
      </div>
    </div>
  );
}

function MainApp() {
  const { instance, accounts } = useMsal();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({...});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get access token
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });

      const accessToken = response.accessToken;

      // Call Azure Function
      const apiResponse = await fetch(`${API_CONFIG.functionUrl}/api/fetch-and-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          hotelName: formData.hotelName,
          timePeriod: {
            startDate: formData.startDate,
            endDate: formData.endDate
          },
          reviewSources: {
            googleMaps: formData.googleMaps,
            tripAdvisor: formData.tripAdvisor,
            otaUrls: {
              booking: formData.bookingUrl
            }
          }
        })
      });

      const result = await apiResponse.json();

      if (result.success) {
        // Store analysis in state
        setAnalysisData(result.analysis);
        setCurrentStep(5); // Show dashboard
      } else {
        alert(`Analysis failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Hotel Voice of Guest</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {accounts[0]?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content - existing wizard or dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 5 ? (
          <Dashboard data={analysisData} />
        ) : (
          <Wizard
            currentStep={currentStep}
            formData={formData}
            onUpdateFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
}

export default App;
```

### Step 5: Build for Production

```bash
# Build the app
npm run build

# Output will be in dist/ folder:
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
```

### Step 6: Inject Configuration

Create a script to inject Azure config into built HTML:

Create `scripts/inject-config.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read environment variables or arguments
const CLIENT_ID = process.env.AZURE_CLIENT_ID || process.argv[2];
const TENANT_ID = process.env.AZURE_TENANT_ID || process.argv[3];
const FUNCTION_URL = process.env.AZURE_FUNCTION_URL || process.argv[4];

if (!CLIENT_ID || !TENANT_ID || !FUNCTION_URL) {
  console.error('Usage: node inject-config.js <CLIENT_ID> <TENANT_ID> <FUNCTION_URL>');
  console.error('Or set environment variables: AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_FUNCTION_URL');
  process.exit(1);
}

const htmlPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Inject config before closing </head> tag
const configScript = `
<script>
  window.AZURE_CONFIG = {
    clientId: '${CLIENT_ID}',
    tenantId: '${TENANT_ID}',
    functionUrl: '${FUNCTION_URL}'
  };
</script>
`;

html = html.replace('</head>', `${configScript}</head>`);

fs.writeFileSync(htmlPath, html);

console.log('✅ Configuration injected into dist/index.html');
console.log(`   Client ID: ${CLIENT_ID}`);
console.log(`   Tenant ID: ${TENANT_ID}`);
console.log(`   Function URL: ${FUNCTION_URL}`);
```

Add to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "build:onedrive": "vite build && node scripts/inject-config.js"
  }
}
```

### Step 7: Build with Configuration

```bash
# Option 1: Using environment variables
export AZURE_CLIENT_ID="a1b2c3d4-e5f6-7890-abcd-1234567890ab"
export AZURE_TENANT_ID="12345678-90ab-cdef-1234-567890abcdef"
export AZURE_FUNCTION_URL="https://hotel-vog-functions.azurewebsites.net"
npm run build:onedrive

# Option 2: Using command line arguments
npm run build
node scripts/inject-config.js \
  "a1b2c3d4-e5f6-7890-abcd-1234567890ab" \
  "12345678-90ab-cdef-1234-567890abcdef" \
  "https://hotel-vog-functions.azurewebsites.net"
```

---

## Deployment to OneDrive

### Option 1: Manual Upload

1. **Build the app:**
   ```bash
   npm run build:onedrive
   ```

2. **Upload to OneDrive:**
   - Open OneDrive in browser
   - Create folder: `Hotel VoG POC/anantara-siam/`
   - Upload entire `dist/` folder contents
   - Rename to match hotel (optional)

3. **Create README.txt:**
   ```
   Hotel Voice of Guest - Anantara Siam

   How to use:
   1. Open index.html in your browser
   2. Sign in with your Microsoft account
   3. Fill out the 4-step form
   4. Submit to receive analysis

   Support: yourname@company.com
   ```

4. **Share with GM:**
   - Right-click folder → Share
   - Enter GM email
   - Permission: "Can view"
   - Send link

### Option 2: Using OneDrive Sync

1. **Install OneDrive Sync:**
   - Download OneDrive client
   - Sign in with company account
   - Sync folder

2. **Copy files:**
   ```bash
   # Copy built files to synced OneDrive folder
   cp -r dist/* ~/OneDrive/HotelVoGPOC/anantara-siam/
   ```

3. **Wait for sync** (automatic)

4. **Share link from OneDrive web**

### Option 3: PowerShell Script (Batch Upload)

Create `scripts/deploy-to-onedrive.ps1`:

```powershell
# Deploy to OneDrive using Graph API

param(
    [string]$HotelName,
    [string]$OneDriveFolder = "Hotel VoG POC"
)

# Build the app
npm run build:onedrive

# Upload using Graph API (requires authentication)
# This is a simplified example - full script would use Microsoft Graph SDK

Write-Host "Built files are ready in dist/"
Write-Host "Please upload manually to OneDrive folder: $OneDriveFolder/$HotelName"
```

---

## Testing the Deployed App

### Step 1: Open in Browser

1. Get OneDrive share link (e.g., `https://[tenant].sharepoint.com/.../index.html`)
2. Open in browser (Chrome, Edge recommended)
3. Click "Sign In with Microsoft"
4. Authenticate with your Microsoft account

### Step 2: Test Form Submission

1. Fill Step 1 (hotel info)
2. Fill Step 2 (date range)
3. Fill Step 3 (review URLs)
4. Fill Step 4 (optional)
5. Click Submit
6. Wait for analysis (2-3 minutes)
7. Verify dashboard displays

### Step 3: Check Browser Console

1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Verify:
   - MSAL login successful
   - Azure Function call returns 200 OK
   - No CORS errors

---

## Troubleshooting

### "Failed to acquire token" Error

**Cause:** MSAL configuration issue

**Fix:**
- Verify Client ID matches App Registration
- Verify Tenant ID matches Azure AD tenant
- Check redirect URI in App Registration includes OneDrive URL

### "CORS policy" Error

**Cause:** Azure Function CORS not configured

**Fix:**
- Add OneDrive domain to Azure Function CORS settings
- Verify format: `https://[tenant].sharepoint.com`

### "401 Unauthorized" Error

**Cause:** Token validation failed

**Fix:**
- Check token expiry (MSAL auto-refreshes)
- Verify TENANT_ID in Azure Function matches
- Verify CLIENT_ID in Azure Function matches

### "Network request failed" Error

**Cause:** Azure Function URL incorrect or offline

**Fix:**
- Verify FUNCTION_URL in injected config
- Test function directly with curl
- Check Azure Function status in portal

### Dashboard Shows No Data

**Cause:** API returned error or empty results

**Fix:**
- Check browser console for API response
- Verify Apify returned reviews
- Check Azure Function logs for errors

---

## Updating the App

### For Bug Fixes

1. Make code changes
2. Rebuild: `npm run build:onedrive`
3. Re-upload `dist/` to OneDrive (overwrite existing)
4. Users refresh browser to see changes

### For Configuration Changes

1. Update credentials (Client ID, Tenant ID, Function URL)
2. Re-run: `node scripts/inject-config.js [new-values]`
3. Re-upload `dist/index.html` only

### For Multiple Hotels

1. Build once: `npm run build:onedrive`
2. Copy `dist/` to multiple OneDrive folders
3. Each hotel gets same code, different folder
4. (Optional) Customize README.txt per hotel

---

## Build Optimization

### Reduce Bundle Size

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          msal: ['@azure/msal-browser', '@azure/msal-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // Remove console.logs in production
      }
    }
  }
});
```

### Enable Compression

OneDrive serves files as-is (no server-side compression), but browsers handle gzip automatically for text files.

---

## CI/CD Pipeline (Future)

Create `.github/workflows/build-and-deploy.yml`:

```yaml
name: Build and Deploy to OneDrive

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build app
        run: npm run build

      - name: Inject config
        run: |
          node scripts/inject-config.js \
            ${{ secrets.AZURE_CLIENT_ID }} \
            ${{ secrets.AZURE_TENANT_ID }} \
            ${{ secrets.AZURE_FUNCTION_URL }}

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: onedrive-build
          path: dist/

      # Manual step: Download artifact and upload to OneDrive
```

---

## Checklist

Before deploying to OneDrive:

- [ ] React app builds without errors
- [ ] MSAL configuration injected correctly
- [ ] Client ID + Tenant ID verified
- [ ] Function URL tested and working
- [ ] App tested locally (using `npm run dev`)
- [ ] App tested with production build (serve `dist/` folder)
- [ ] Browser console shows no errors
- [ ] MSAL login popup works
- [ ] API call returns 200 OK
- [ ] Dashboard displays analysis

---

**Document Version:** 1.0
**Last Updated:** 2026-01-21
**Prepared By:** Dev Team
