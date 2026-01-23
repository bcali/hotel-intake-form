# Claude Code Session History

This file tracks the context, decisions, and progress for this project across Claude Code sessions.

## Project Overview

**Hotel Voice of Guest - Automated Review Analysis Tool**

A web application that:
- Collects hotel reviews from multiple sources (Google Maps, TripAdvisor, OTAs)
- Uses Azure OpenAI to analyze sentiment and identify themes
- Generates actionable insights for hotel management
- Integrates with Azure AD for authentication

## Current Status (2026-01-23)

### ✅ Completed

1. **Azure AD Authentication Setup**
   - Environment variables configured in `.env.local` (git-ignored)
   - MSAL authentication integrated
   - Login/logout flow implemented with redirect (not popup)
   - Dev credentials received from IT

2. **Security Configuration**
   - Credentials stored in `.env.local` (never committed to git)
   - `.env.example` created as template
   - `.gitignore` updated to exclude all `.env*` files

3. **App Configuration**
   - Switched from [App.tsx](src/App.tsx) to [App-with-MSAL.tsx](src/App-with-MSAL.tsx)
   - Fixed TypeScript import errors (AccountInfo as type-only import)
   - Changed from popup to redirect authentication for reliability
   - Debug logging added to [msal-config.ts](src/config/msal-config.ts#L37-L43)

### 🔄 In Progress

**Waiting on IT: Admin Consent Required**

The app is fully configured but needs IT to grant admin consent for the `User.Read` permission.

**Details:**
- App Registration: `ITC-28857 App Register for MS Graph`
- Client ID: `6d05f734-4242-43d2-a9ae-7d9f1de0249c`
- Tenant: `b3ba11e4-10a7-410f-bb6c-2e0c86433436` (minordev.com)
- Error: "Need admin approval" when logging in

**What IT needs to do:**
1. Go to Azure Portal → App Registrations → ITC-28857 App Register for MS Graph
2. Click "API Permissions"
3. Click "Grant admin consent for Minor Hotel Group Limited"

### 📋 Next Steps

Once admin consent is granted:
1. Test full authentication flow
2. Test wizard form (4 steps)
3. Implement Azure Functions integration for review analysis
4. Set up Managed Identity for Azure OpenAI access (see [MANAGED-IDENTITY-GUIDE.md](MANAGED-IDENTITY-GUIDE.md))
5. Deploy to OneDrive for production POC

## Development Environment

### Credentials (Dev Environment)

**App Registration:**
- Application (client) ID: `6d05f734-4242-43d2-a9ae-7d9f1de0249c`
- Directory (tenant) ID: `b3ba11e4-10a7-410f-bb6c-2e0c86433436`
- Client Secret: Stored in `.env.local` (DO NOT COMMIT)

**Test User:**
- Email: `bclark@minordev.com`
- Password: Stored in IT records

### Environment Variables

Located in `.env.local` (git-ignored):
```bash
VITE_AZURE_CLIENT_ID=6d05f734-4242-43d2-a9ae-7d9f1de0249c
VITE_AZURE_TENANT_ID=b3ba11e4-10a7-410f-bb6c-2e0c86433436
VITE_AZURE_CLIENT_SECRET=<stored-securely>
VITE_DEV_USER_EMAIL=bclark@minordev.com
```

### Running Locally

```bash
npm run dev
# Server runs on http://localhost:5173/hotel-intake-form/
```

**Important:** Restart dev server after changing `.env.local` for changes to take effect.

## Key Technical Decisions

### Authentication: Redirect vs Popup

**Decision:** Use redirect-based authentication
- **Why:** More reliable, no popup blockers, better mobile support
- **Changed in:** [login-screen.tsx](src/components/login-screen.tsx#L23)
- **Changed in:** [App-with-MSAL.tsx](src/App-with-MSAL.tsx#L257)

### Environment Variable Strategy

**Decision:** Use `.env.local` for dev, window injection for production
- **Dev:** Vite reads from `.env.local`
- **Production:** Build script injects into `window.AZURE_CONFIG`
- **See:** [msal-config.ts](src/config/msal-config.ts#L23-L33)

### Repository Structure

```
hotel-intake-form/
├── src/
│   ├── App.tsx                    # Original app (no auth)
│   ├── App-with-MSAL.tsx          # Current app (with Azure AD)
│   ├── main.tsx                   # Entry point (uses App-with-MSAL)
│   ├── config/
│   │   └── msal-config.ts         # MSAL configuration
│   └── components/
│       ├── login-screen.tsx       # Login UI
│       ├── property-step.tsx      # Step 1: Hotel info
│       ├── time-period-step.tsx   # Step 2: Date range
│       ├── reviews-step.tsx       # Step 3: Review sources
│       ├── social-step.tsx        # Step 4: Social/notes
│       └── dashboard.tsx          # Results view
├── .env.local                     # Dev credentials (git-ignored)
├── .env.example                   # Template (committed)
└── IT-MEETING-SUMMARY.md          # IT collaboration notes
```

## Known Issues

### Admin Consent Required
- **Status:** Blocking authentication
- **Owner:** IT Team
- **Resolution:** Waiting for IT to grant admin consent

### Environment Variables Not Loading
- **Solution:** Restart dev server after changing `.env.local`
- **Verification:** Check browser console for "MSAL Config" debug message

## Architecture Notes

### Current: Single Page App with Azure Functions Backend

```
Browser (React)
    ↓ (Azure AD Auth)
Azure Functions
    ↓ (Managed Identity)
Azure OpenAI
```

### Future: OneDrive Static HTML Deployment

See [BUILD-STATIC-HTML.md](BUILD-STATIC-HTML.md) and [MANAGED-IDENTITY-GUIDE.md](MANAGED-IDENTITY-GUIDE.md)

## IT Contacts & Resources

- **IT Meeting Summary:** [IT-MEETING-SUMMARY.md](IT-MEETING-SUMMARY.md)
- **Ticket:** ITC-28857 App Register for MS Graph
- **Status:** Waiting for admin consent

## Important Files

- `.env.local` - **NEVER COMMIT** - Contains secrets
- `.env.example` - Template for other developers
- `.gitignore` - Blocks `.env*` files from being committed
- `msal-config.ts` - Handles both dev (env vars) and prod (window injection)

## Session Reminders for Claude

When resuming work on this project:
1. Check if admin consent has been granted (blocking issue)
2. Environment variables are in `.env.local` (git-ignored)
3. Dev server URL: http://localhost:5173/hotel-intake-form/
4. Test credentials: `bclark@minordev.com`
5. The app uses [App-with-MSAL.tsx](src/App-with-MSAL.tsx), not App.tsx

## Last Updated

2026-01-23 - Initial setup and authentication configuration complete, waiting for IT admin consent
