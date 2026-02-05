# Claude Code Session History

This file tracks the context, decisions, and progress for this project across Claude Code sessions.

## Project Overview

**Hotel Voice of Guest - Automated Review Analysis Tool**

A web application that:
- Collects hotel reviews from multiple sources (Google Maps, TripAdvisor, OTAs)
- Uses Claude AI to analyze sentiment and identify themes
- Generates actionable insights for hotel management
- Supports both independent POC deployment and corporate (Minor) deployment

## Current Status (2026-02-03)

### 🚀 NEW: Independent POC Stack

**Pivoted away from Minor IT dependencies to prove out the concept independently.**

| Component | Technology | Status |
|-----------|------------|--------|
| Hosting | Firebase Hosting | Ready |
| Auth | Supabase Auth | Ready |
| Database | Supabase PostgreSQL | Ready |
| AI Analysis | Claude API | Ready |

### ✅ Completed - POC Refactor

1. **Removed Azure/MSAL Dependencies**
   - Removed `@azure/msal-browser` and `@azure/msal-react`
   - Removed [msal-config.ts](src/config/msal-config.ts) (Azure config)
   - Removed [App-with-MSAL.tsx](src/App-with-MSAL.tsx) (Azure version)

2. **Added Supabase Integration**
   - Created [supabase.ts](src/config/supabase.ts) - Supabase client config
   - Created [auth-context.tsx](src/context/auth-context.tsx) - React auth context
   - Updated [login-screen.tsx](src/components/login-screen.tsx) - Email/password + magic link

3. **Added Claude AI Integration**
   - Created [claude.ts](src/services/claude.ts) - Client-side service
   - Created [analyze-reviews/index.ts](supabase/functions/analyze-reviews/index.ts) - Edge function

4. **Updated App Structure**
   - [App.tsx](src/App.tsx) now uses Supabase auth (not MSAL)
   - [main.tsx](src/main.tsx) imports from App.tsx
   - Removed Azure-specific environment variables

5. **Deployment Configuration**
   - Created [firebase.json](firebase.json) - Firebase Hosting config
   - Updated [vite.config.ts](vite.config.ts) - Standard Vite build
   - Created [SETUP-POC.md](SETUP-POC.md) - Complete setup guide

### 📁 Previous Azure Work (Preserved)

The Azure/Minor-specific code is still in the repo if needed later:
- `src/App-with-MSAL.tsx` - MSAL version of the app
- `src/config/msal-config.ts` - Azure AD configuration

## Quick Start (POC)

### 1. Set up Supabase
```bash
# Create project at supabase.com, then:
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 2. Deploy Edge Function
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-id
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
supabase functions deploy analyze-reviews
```

### 3. Run Locally
```bash
npm install
npm run dev
# Open http://localhost:5173
```

### 4. Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```

## Environment Variables

Located in `.env.local` (git-ignored):
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note:** Claude API key is stored in Supabase secrets, NOT in frontend env vars.

## Repository Structure

```
hotel-intake-form/
├── src/
│   ├── App.tsx                    # Main app (Supabase auth)
│   ├── App-with-MSAL.tsx          # Azure version (preserved)
│   ├── main.tsx                   # Entry point
│   ├── config/
│   │   ├── supabase.ts            # Supabase client
│   │   └── msal-config.ts         # Azure config (preserved)
│   ├── context/
│   │   └── auth-context.tsx       # Supabase auth context
│   ├── services/
│   │   └── claude.ts              # Claude API service
│   └── components/
│       ├── login-screen.tsx       # Login UI (Supabase)
│       ├── property-step.tsx      # Step 1: Hotel info
│       ├── time-period-step.tsx   # Step 2: Date range
│       ├── reviews-step.tsx       # Step 3: Review sources
│       ├── social-step.tsx        # Step 4: Social/notes
│       └── dashboard.tsx          # Results view
├── supabase/
│   └── functions/
│       └── analyze-reviews/       # Claude API edge function
├── .env.local                     # Credentials (git-ignored)
├── .env.example                   # Template
├── firebase.json                  # Firebase Hosting config
├── SETUP-POC.md                   # Detailed setup guide
└── CLAUDE.md                      # This file
```

## Migration Path

### POC → Minor/Azure

When IT is ready and POC is proven:

1. **Auth**: Swap Supabase Auth → MSAL (Azure AD)
   - Re-enable `App-with-MSAL.tsx`
   - Update `main.tsx` import

2. **AI**: Swap Claude API → Azure OpenAI
   - Update edge function or create Azure Function
   - Use Managed Identity for auth

3. **Hosting**: Swap Firebase → Azure Static Web Apps
   - Deploy via GitHub Actions or Azure CLI

4. **Database**: Swap Supabase → Azure (if needed)
   - Cosmos DB or Azure SQL

**The React UI components stay the same - only infrastructure changes.**

## Previous Azure Work (Reference)

### IT Ticket Status
- **Ticket:** ITC-28857 App Register for MS Graph
- **Status:** Pending - redirect URIs + developer sandbox request
- **App Registration:** `6d05f734-4242-43d2-a9ae-7d9f1de0249c`

### Why We Pivoted
- IT approval process was blocking progress
- OneDrive hosting doesn't work (blocks JavaScript)
- POC needed to prove value before IT investment

## Key Decisions

### Independent POC Approach
**Decision:** Build POC outside Minor infrastructure first
- **Why:** Faster iteration, no IT dependencies, prove value first
- **Trade-off:** Will need migration work when moving to corporate stack
- **Benefit:** Working demo to show stakeholders

### Supabase for Auth
**Decision:** Use Supabase Auth (not Auth0, Firebase Auth, etc.)
- **Why:** Already have Supabase available, includes database, edge functions
- **Benefit:** Single platform for auth + DB + serverless

### Claude for Analysis
**Decision:** Use Claude API (not OpenAI, Gemini)
- **Why:** User preference, excellent for analysis tasks
- **Cost:** ~$0.01-0.05 per review analysis

## Session Reminders for Claude

When resuming work on this project:
1. **POC Stack:** Supabase + Claude + Firebase (not Azure)
2. App uses [App.tsx](src/App.tsx) with Supabase auth
3. Environment variables are in `.env.local` (Supabase keys)
4. Claude API key is in Supabase secrets (not frontend)
5. Edge function at `supabase/functions/analyze-reviews/`
6. Setup guide: [SETUP-POC.md](SETUP-POC.md)
7. Azure code preserved in `App-with-MSAL.tsx` for later migration

## Last Updated

2026-02-03 - Refactored to independent POC stack (Supabase + Claude + Firebase)
