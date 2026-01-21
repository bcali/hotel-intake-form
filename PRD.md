# PRD: Hotel Voice of Guest Intake & Automated Action Plan Generator

## Overview
This document defines the product requirements for an **internal hotel intake experience** that collects structured review links, **automatically scrapes and analyzes guest feedback**, and returns a **hotel-ready, actionable improvement plan** in real-time.

The system is designed to be:
- Simple for hotel teams (one-click submission)
- Fully automated (no manual processing)
- Internally hosted on OneDrive
- Prompt-safe (hotels never see the analysis logic)
- Scalable across many properties

---

## Problem

Hotel GMs and department heads know guest reviews drive bookings, but today they lack a **simple, consistent way** to translate feedback across **Google Maps, TripAdvisor, Booking.com, and other platforms** into **clear, prioritized actions** owned by departments (Housekeeping, Front Office, Engineering, F&B).

Current pain points:
- Feedback is fragmented across channels
- Actions are reactive and anecdotal
- No consistent prioritization by frequency, severity, and booking impact
- Manual review gathering is time-consuming (30-60 min per hotel)
- Review responses, photos, and social proof are inconsistent by property

As a result, hotels miss opportunities to improve ratings, rankings, and conversion.

---

## High-Level Approach

Build an **internal-only static web application** hosted on OneDrive that:
- Collects hotel identifiers and review platform URLs
- **Automatically scrapes reviews** via Apify API (Google Maps, TripAdvisor, Booking.com)
- **Analyzes reviews in real-time** via Microsoft Copilot (Azure OpenAI)
- Returns a **GM-ready dashboard** with sentiment, themes, and prioritized actions

**Technical Architecture:**
- **Frontend:** React SPA compiled to static HTML, hosted on OneDrive/SharePoint
- **Authentication:** MSAL.js 2.0 with Azure AD (Entra ID)
- **Backend:** Azure Functions (serverless, Node.js 20)
- **Review Scraping:** Apify API (third-party service)
- **AI Analysis:** Microsoft Copilot / Azure OpenAI (GPT-4o)
- **Storage:** Stateless (no persistent database for POC)
- **Security:** API keys stored server-side only, Azure AD token validation

**Key Design Principles:**
- **Real-time Analysis:** Submit → Scrape → Analyze → Dashboard (2-3 minutes)
- **Zero Installation:** Runs in browser, no software to install
- **Secure by Design:** API keys never exposed in browser, all processing server-side
- **Pay-per-Use:** Azure Functions consumption plan, only pay when used

---

## Narrative

### Today (Manual Process - 60+ minutes)
- A GM notices a rating decline but cannot quickly identify root causes
- GM manually copies 20-30 reviews from Google Maps
- GM manually copies 15-20 reviews from TripAdvisor
- GM manually copies 10-15 reviews from Booking.com
- GM pastes reviews into Word document or spreadsheet
- GM emails document to analyst or uses ChatGPT manually
- Analyst processes reviews and creates report (30-45 minutes)
- Report emailed back to GM (24-48 hour turnaround)
- **Total time: 60-90 minutes of GM time + analyst time**

### Tomorrow (Automated - 5 minutes)
- GM opens index.html from their OneDrive folder
- Signs in with Microsoft 365 account (one click)
- Pastes Google Maps, TripAdvisor, and Booking.com URLs
- Selects date range (last 30/60/90 days)
- Clicks "Analyze Reviews"
- **Waits 2-3 minutes while system:**
  - Scrapes 50 reviews from each source (Apify)
  - Analyzes with Microsoft Copilot (Azure OpenAI)
  - Generates dashboard
- **Dashboard displays:**
  - Overall sentiment score (0-100)
  - Top 3 positive themes (quantified by mentions)
  - Top 3 negative themes (quantified by mentions)
  - Top 5 prioritized action items (P0/P1/P2, department-assigned)
  - Executive summary (GM-ready paragraph)
- **Total time: 5 minutes**
- **Time saved: 55-85 minutes per analysis**

---

## Goals

1. Enable hotels to get **real-time analysis** in **under 5 minutes** total time
2. **Automate review gathering** - eliminate manual copy/paste (save 30-60 min per hotel)
3. Produce **actionable insights** without analyst intervention
4. Standardize guest feedback analysis across properties

### Metrics

#### North Star
- **End-to-End Time (Submission → Dashboard)**
  - Target: **≤3 minutes** (P95)
  - Includes: Review scraping (2 min) + AI analysis (1 min)

#### Secondary Metrics
- Successful analysis rate ≥95% (no errors, complete dashboard)
- GM satisfaction score ≥8/10 (actionable insights)
- Time saved vs manual: ≥30 minutes per analysis
- Weekly active properties (pilot target: 10–20)
- Cost per analysis: ≤$3 (Apify + Copilot combined)

#### Guardrails
- Prompt exposure incidents: **0**
- API key exposure incidents: **0**
- Authentication bypass incidents: **0**

---

## Impact Sizing Model (Illustrative)

**Assumptions (to validate):**
- 20 pilot hotels
- 2 reports per hotel per month
- +0.05 average rating improvement over 90 days
- Conservative conversion uplift: 0.5%–1.5%

**Example math:**
- Avg direct revenue per hotel: $200k/month
- Low case: 20 × $200k × 0.5% = $20k/month
- High case: 20 × $200k × 1.5% = $60k/month

**Confidence:** Low–Medium (pilot required to validate)

---

## Non-Goals (POC Scope)

- ❌ Persistent database for historical trend analysis (future enhancement)
- ❌ Email notifications (future enhancement)
- ❌ PDF export (browser print-to-PDF sufficient for POC)
- ❌ Multi-user collaboration features
- ❌ Task management or action tracking system
- ❌ Competitive benchmarking dashboards
- ❌ Perfect multilingual sentiment analysis
- ❌ External/public access (internal tool only)
- ❌ Scheduled/recurring analysis (on-demand only for POC)

---

## Implementation Phases

### Phase 1: Localhost Proof-of-Concept (Completed ✅)

**Purpose:** Validate UX and data structure before IT infrastructure

**Implementation:**
- React app with 4-step wizard
- Form validation and auto-save
- JSON download on submission
- Mock dashboard
- **Status:** Complete, tested, documented

**Learnings:**
- Form flow validated with stakeholders
- Data structure confirmed for analysis prompt
- JSON format validated with [ANALYSIS-PROMPT.md](./ANALYSIS-PROMPT.md)
- Business case proven with manual workflow

### Phase 2: OneDrive + Azure Backend (Current Focus 🔄)

**Purpose:** Production POC with real-time automated analysis

**Implementation:**
- **Frontend:** Static HTML hosted on OneDrive (MSAL.js authentication)
- **Backend:** Azure Functions calling Apify + Copilot
- **Deployment:** IT team provisions Azure resources
- **Timeline:** 2-3 weeks from IT approval

**Components:**
1. Azure App Registration (authentication)
2. Azure Function App (backend processing)
3. Apify account (review scraping)
4. Azure OpenAI deployment (AI analysis)
5. Static HTML build (OneDrive deployment)

**See detailed documentation:**
- [IT-REQUIREMENTS.md](./IT-REQUIREMENTS.md)
- [IT-DEPLOYMENT-CHECKLIST.md](./IT-DEPLOYMENT-CHECKLIST.md)
- [ARCHITECTURE-ONEDRIVE.md](./ARCHITECTURE-ONEDRIVE.md)
- [BUILD-STATIC-HTML.md](./BUILD-STATIC-HTML.md)

### Phase 3: Production Scale (Future)

**Enhancements after successful POC:**
- Historical trend tracking (Azure SQL database)
- Email notifications (Power Automate)
- Scheduled recurring analysis
- PDF export with branding
- Multi-property comparison dashboard
- Power BI integration

---

## Solution Alignment

This product is a **proxy interface** for the hidden analysis prompt.

**In scope**
- Intake form
- Validation logic
- Secure backend execution
- Report generation and storage

**Out of scope**
- Data ingestion automation
- Workflow/task management
- External user access

---

## Key Features (POC Scope)

### 1. Static HTML Application (OneDrive Hosted)

**What:**
- React app compiled to static HTML/JS/CSS
- Hosted in OneDrive folder (no web server needed)
- Each hotel gets their own folder with `index.html`
- Opens directly in browser (Chrome, Edge)

**Why:**
- Zero installation required
- No GitHub Pages/public hosting needed
- IT can easily distribute via OneDrive sharing
- Runs under user's Microsoft 365 identity

### 2. Azure AD Authentication (MSAL.js)

**What:**
- "Sign in with Microsoft" button
- MSAL.js 2.0 popup authentication
- Bearer token obtained for API calls
- Auto-refresh when token expires

**Why:**
- Secure user identity verification
- Audit trail (who submitted what, when)
- API key protection (token validated server-side)
- No separate password management

**User Flow:**
1. Open `index.html` in OneDrive
2. Click "Sign In with Microsoft"
3. Authenticate with Microsoft 365 account
4. Grant consent (first time only)
5. Proceed to form

### 3. 4-Step Intake Wizard

**Step 1: Property Information**
- Hotel name, brand, country, city/area
- Local language (for review matching)
- Optional: Keywords for matching

**Step 2: Time Period**
- Start date, end date
- Max range: 180 days
- Defaults to last 30 days

**Step 3: Review Sources**
- Google Maps URL (required)
- TripAdvisor URL (required)
- OTA selection (Booking.com, Agoda, etc.)
- OTA-specific URLs

**Step 4: Additional Context (Optional)**
- Social media links
- Internal notes for analyst

**Validation:**
- Required field enforcement
- URL domain validation
- Date range limits

### 4. Automated Review Scraping (Apify API)

**What:**
- Azure Function calls Apify actors on behalf of user
- Fetches up to 50 reviews per source (configurable)
- Sources: Google Maps, TripAdvisor, Booking.com
- Scraping happens server-side (API keys hidden)

**Why:**
- Eliminates 30-60 min of manual copy/paste
- Ensures consistent data quality
- Scales to hundreds of reviews easily
- No browser automation needed

**Process:**
1. User submits form
2. Azure Function receives request
3. Function calls Apify actors in parallel:
   - Google Maps Scraper
   - TripAdvisor Scraper
   - Booking.com Scraper
4. Aggregates review data
5. Returns structured JSON to browser

**Cost:** ~$1.50-2.00 per analysis (150 reviews total)

### 5. AI Analysis (Microsoft Copilot / Azure OpenAI)

**What:**
- Azure Function calls Azure OpenAI API
- GPT-4o model (or Copilot deployment)
- Hidden analysis prompt (based on [ANALYSIS-PROMPT.md](./ANALYSIS-PROMPT.md))
- Structured JSON output

**Why:**
- Consistent analysis framework
- GM-ready insights
- Actionable priorities
- Prompt logic never exposed to hotels

**Analysis Output:**
```json
{
  "sentiment": {
    "overall": 78,
    "trend": "improving"
  },
  "topPositiveThemes": [
    {
      "theme": "Exceptional staff service",
      "mentions": 42,
      "impact": "high"
    }
  ],
  "topNegativeThemes": [
    {
      "theme": "Room maintenance issues",
      "mentions": 18,
      "impact": "medium"
    }
  ],
  "actionItems": [
    {
      "priority": "P0",
      "department": "Housekeeping",
      "action": "Implement daily AC maintenance checks",
      "impact": "Addresses 18 guest complaints"
    }
  ],
  "executiveSummary": "Overall sentiment is positive..."
}
```

**Cost:** ~$0.10-0.50 per analysis

### 6. Real-Time Dashboard

**What:**
- Results displayed immediately after analysis
- Interactive charts (sentiment, themes)
- Prioritized action items
- Executive summary

**Components:**
- **KPI Cards:** Sentiment score, total reviews, rating average
- **Theme Analysis:** Top 3 positive, top 3 negative (bar charts)
- **Action Items:** P0/P1/P2 prioritized list with department assignments
- **Executive Summary:** GM-ready paragraph

**User Actions:**
- Print to PDF (browser native)
- Start new analysis
- Sign out

### 7. Security & Compliance

**Managed Identity (Best Practice):**
- ✅ **Azure OpenAI:** Uses Managed Identity (no API keys!)
  - Function App authenticates automatically via Azure
  - No secrets to manage or rotate
  - Microsoft recommended approach
  - Automatic audit trail
- ✅ **Apify:** API token stored in Azure Function environment variables
- ✅ Never exposed in browser code or HTML
- ✅ Only Azure Function can access

**User Authentication:**
- ✅ Bearer token validation on every API request
- ✅ Token signature verified against Azure AD public keys
- ✅ User identity logged for audit trail

**Data Privacy:**
- ✅ No persistent storage of review content
- ✅ Stateless processing (results displayed, not saved)
- ✅ Logs retained for 30 days only
- ✅ No PII logged

---

## Key Flows

### Flow 1: Happy Path (End-to-End)

**User Journey:**
1. GM receives OneDrive share link from IT
2. Opens `index.html` in browser
3. Clicks "Sign In with Microsoft"
4. MSAL.js popup → Authenticates with Microsoft 365
5. Returns to app (now authenticated)

6. **Step 1:** Enters hotel details
   - Hotel name: "Anantara Siam"
   - Brand: "Anantara"
   - Country: "Thailand"
   - City: "Bangkok"

7. **Step 2:** Selects date range
   - Start: 2026-01-01
   - End: 2026-01-20

8. **Step 3:** Pastes review URLs
   - Google Maps: [paste URL]
   - TripAdvisor: [paste URL]
   - Booking.com: [paste URL]

9. **Step 4:** (Optional) Adds notes
   - Skips (optional)

10. Clicks "Submit & Analyze"

11. **Processing (2-3 minutes):**
    - Loading spinner displayed
    - Status updates:
      - "Authenticating..." ✓
      - "Fetching Google Maps reviews..." ✓ (42 reviews)
      - "Fetching TripAdvisor reviews..." ✓ (38 reviews)
      - "Fetching Booking.com reviews..." ✓ (29 reviews)
      - "Analyzing with AI..." ✓
      - "Generating dashboard..." ✓

12. **Dashboard displayed:**
    - Sentiment: 78/100 (improving)
    - Top themes visualized
    - 5 prioritized actions
    - Executive summary

13. GM prints to PDF or shares with team

**Technical Flow:**
```
Browser (MSAL.js) → Acquire token
  ↓
POST /api/fetch-and-analyze + Bearer token
  ↓
Azure Function validates token
  ↓
Apify API calls (parallel):
  - Google Maps Scraper
  - TripAdvisor Scraper
  - Booking.com Scraper
  ↓
Aggregate reviews (109 total)
  ↓
Azure OpenAI API call (Copilot)
  ↓
Return JSON analysis
  ↓
Browser renders dashboard
```

### Flow 2: Validation Errors

**Before Submission:**
- Missing hotel name → Inline error: "Hotel name is required"
- Invalid Google Maps URL → Warning: "URL must be from google.com/maps"
- Date range > 180 days → Error: "Maximum range is 180 days"
- No OTA selected → Error: "Select at least one OTA"

**User fixes errors and resubmits**

### Flow 3: API Errors

**Scenario A: Apify Scraping Failure**
- Cause: Invalid URL, rate limit, or Apify downtime
- User sees: "Failed to fetch reviews from Google Maps. Please check the URL and try again."
- Fallback: User can retry or skip that source

**Scenario B: Copilot Analysis Failure**
- Cause: Azure OpenAI quota exceeded or deployment offline
- User sees: "AI analysis failed. Please try again later or contact support."
- Fallback: Raw review data displayed (minimal view)

**Scenario C: Network Timeout**
- Cause: Slow network or Azure Function timeout (>5 min)
- User sees: "Request timed out. This may happen with very large date ranges. Try a shorter period."
- Fallback: Retry with reduced date range

### Flow 4: Authentication Errors

**Scenario A: Token Expired**
- MSAL.js automatically refreshes token
- User not impacted (seamless)

**Scenario B: User Not Authorized**
- Cause: User not in tenant or App Registration misconfigured
- User sees: "Access denied. Please contact IT support."
- Action: IT verifies App Registration settings

### Flow 5: First-Time User Setup

**What IT Does:**
1. Creates OneDrive folder: `Hotel VoG POC/anantara-siam/`
2. Uploads static HTML files
3. Creates README.txt with instructions
4. Shares folder with GM email
5. Sends welcome email with link

**What GM Does:**
1. Clicks link in email
2. Opens OneDrive folder in browser
3. Reads README.txt
4. Clicks `index.html`
5. Signs in (first time: consent popup)
6. Uses tool

---

## Technical Specifications

### Frontend Stack
- **Framework:** React 19
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v3
- **Authentication:** MSAL.js 2.0 (@azure/msal-browser, @azure/msal-react)
- **Charts:** Recharts or Chart.js
- **Icons:** Lucide React

### Backend Stack
- **Runtime:** Node.js 20 LTS
- **Platform:** Azure Functions v4
- **Dependencies:**
  - `apify-client` (review scraping)
  - `@azure/openai` (AI analysis)
  - `jsonwebtoken` (token validation)
  - `jwks-rsa` (Azure AD key verification)

### API Endpoints

**POST /api/fetch-and-analyze**
- **Auth:** Bearer token (Azure AD)
- **Input:**
  ```json
  {
    "hotelName": "Anantara Siam",
    "timePeriod": {
      "startDate": "2026-01-01",
      "endDate": "2026-01-20"
    },
    "reviewSources": {
      "googleMaps": "https://...",
      "tripAdvisor": "https://...",
      "otaUrls": {
        "booking": "https://..."
      }
    }
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "hotelName": "Anantara Siam",
    "totalReviews": 109,
    "analysis": {
      "sentiment": {...},
      "topPositiveThemes": [...],
      "topNegativeThemes": [...],
      "actionItems": [...],
      "executiveSummary": "..."
    },
    "rawReviews": {
      "googleMaps": [...],
      "tripAdvisor": [...],
      "booking": [...]
    },
    "processedAt": "2026-01-21T10:15:30.123Z",
    "processedBy": "gm@anantara.com"
  }
  ```
- **Timeout:** 5 minutes
- **Rate Limit:** 10 requests/hour per user (recommended)

### Environment Variables (Azure Function)
- `APIFY_API_TOKEN` - Apify API token
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint URL
- `AZURE_OPENAI_KEY` - Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT` - Model deployment name (e.g., `gpt-4o`)
- `TENANT_ID` - Azure AD tenant ID
- `CLIENT_ID` - App Registration client ID

### Configuration (Static HTML)
Injected via script tag in `index.html`:
```javascript
window.AZURE_CONFIG = {
  clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tenantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  functionUrl: 'https://hotel-vog-functions.azurewebsites.net'
};
```

### Required Fields (Form Validation)
- ✅ Hotel name, brand, country, city/area
- ✅ Date range (start date, end date, max 180 days)
- ✅ Google Maps URL (domain: google.com)
- ✅ TripAdvisor URL (domain: tripadvisor.com)
- ✅ At least one OTA selected
- ✅ OTA URL for selected OTAs
- ⚠️ Keywords (optional but recommended)
- ⚠️ Social links (optional)
- ⚠️ Internal notes (optional)

### URL Validation Rules
- **Google Maps:** Must contain `google.com/maps` or `google.com/travel`
- **TripAdvisor:** Must contain `tripadvisor.com`
- **Booking.com:** Must contain `booking.com/hotel`
- **Agoda:** Must contain `agoda.com`

### Review Scraping Limits
- **Max reviews per source:** 50 (configurable)
- **Total reviews:** ~150 (50 × 3 sources)
- **Cost per source:** ~$0.50-0.75
- **Time per source:** ~30-60 seconds

### AI Analysis Prompt
- **Model:** GPT-4o (or Copilot deployment)
- **Temperature:** 0.3 (consistent outputs)
- **Max tokens:** 2000
- **System prompt:** Hidden from users (see [ANALYSIS-PROMPT.md](./ANALYSIS-PROMPT.md))
- **Output format:** Structured JSON

### Prioritization Formula
