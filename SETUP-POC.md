# Hotel Voice of Guest - POC Setup Guide

This guide covers setting up the independent POC deployment using Supabase + Claude AI + Firebase Hosting.

## Architecture

```
Firebase Hosting (Static site)
    ↓
React SPA (Vite build)
    ↓ (Auth)
Supabase Auth (email/password or magic link)
    ↓ (API calls)
Supabase Edge Functions
    ↓ (secure API call)
Claude API (review analysis)
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Claude API account (console.anthropic.com)
- Firebase CLI (for deployment)

## Step 1: Supabase Setup

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it something like `hotel-voice-poc`
4. Choose a region close to you
5. Set a database password (save this!)
6. Wait for project to be created

### 1.2 Get API Credentials
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 1.3 Configure Authentication
1. Go to **Authentication → Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable "Confirm email" or disable for faster testing
4. Go to **Authentication → URL Configuration**
5. Add your site URL when deployed (e.g., `https://your-app.web.app`)

### 1.4 Deploy Edge Function
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login and link project:
   ```bash
   supabase login
   supabase link --project-ref your-project-id
   ```

3. Set Claude API secret:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. Deploy the function:
   ```bash
   supabase functions deploy analyze-reviews
   ```

## Step 2: Claude API Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create a new API key
5. Add billing (even $5-10 is plenty for POC)
6. Copy the key (starts with `sk-ant-...`)
7. Use this key in Step 1.4 above

## Step 3: Local Development

### 3.1 Install Dependencies
```bash
cd hotel-intake-form
npm install
```

### 3.2 Configure Environment
Create `.env.local` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 Run Dev Server
```bash
npm run dev
```
Open http://localhost:5173

### 3.4 Test Authentication
1. Click "Sign Up" tab
2. Enter email and password
3. Check email for confirmation (if enabled)
4. Sign in

## Step 4: Firebase Deployment

### 4.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 4.2 Login and Initialize
```bash
firebase login
firebase init hosting
```

When prompted:
- Select "Use an existing project" or create new
- Public directory: `dist`
- Single-page app: Yes
- Don't overwrite index.html

### 4.3 Build and Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at `https://your-project-id.web.app`

### 4.4 Update Supabase Redirect URLs
After deploying, go back to Supabase:
1. **Authentication → URL Configuration**
2. Add your Firebase URL to "Redirect URLs"
3. Add to "Site URL" if it's your primary domain

## Troubleshooting

### "Supabase is not configured"
- Check `.env.local` exists and has correct values
- Restart dev server after changing env vars

### Auth not working
- Check Supabase dashboard for auth logs
- Verify redirect URLs are configured
- Check browser console for errors

### Edge function failing
- Check function logs: `supabase functions logs analyze-reviews`
- Verify ANTHROPIC_API_KEY is set: `supabase secrets list`
- Check Claude API billing/limits

### CORS errors
- The edge function includes CORS headers
- Verify your domain is allowed

## Cost Estimates

| Service | Free Tier | Expected POC Cost |
|---------|-----------|-------------------|
| Supabase | 50K auth users, 500MB DB | $0 |
| Claude API | Pay-as-you-go | $1-5/month |
| Firebase Hosting | 10GB/month | $0 |

**Total estimated POC cost: $1-5/month**

## Migrating Back to Minor/Azure

When ready to move to corporate infrastructure:

1. **Auth**: Replace Supabase Auth with MSAL (Azure AD)
2. **API**: Replace Supabase Edge Function with Azure Functions
3. **AI**: Replace Claude API with Azure OpenAI
4. **Hosting**: Replace Firebase with Azure Static Web Apps

The React UI components remain the same - only the auth and API layers change.
