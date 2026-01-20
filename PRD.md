# PRD: Hotel Voice of Guest Intake & Automated Action Plan Generator

## Overview
This document defines the product requirements for an **internal hotel intake experience** that collects structured review and social inputs, runs a **hidden analysis prompt**, and returns a **hotel-ready, actionable improvement plan**.  

The system is designed to be:
- Simple for hotel teams
- Internally hosted
- Prompt-safe (hotels never see the analysis logic)
- Scalable across many properties

---

## Problem

Hotel GMs and department heads know guest reviews drive bookings, but today they lack a **simple, consistent way** to translate feedback across **Google Maps, TripAdvisor, Booking.com, Agoda, and social platforms** into **clear, prioritized actions** owned by departments (Housekeeping, Front Office, Engineering, F&B).

Current pain points:
- Feedback is fragmented across channels
- Actions are reactive and anecdotal
- No consistent prioritization by frequency, severity, and booking impact
- Review responses, photos, and social proof are inconsistent by property

As a result, hotels miss opportunities to improve ratings, rankings, and conversion.

---

## High-Level Approach

Build an **internal-only web intake form** that collects:
- Hotel identifiers
- Analysis time period
- Public review and OTA links
- Optional social links and context

On submission, the application uses **Microsoft Graph API (delegated permissions)** to write submission data to the user's **OneDrive personal folder** (`/intake_submissions/`). A separate process retrieves these submissions, executes a **hidden analysis prompt**, and generates a **GM-ready action report**.

**Technical Implementation:**
- **Frontend:** React SPA hosted on GitHub Pages
- **Authentication:** MSAL.js 2.0 with Entra ID (delegated user credentials)
- **Storage:** Microsoft Graph API `Files.ReadWrite` (delegated) to user's OneDrive
- **Analysis:** Offline process (manual or automated) reads submissions and generates reports
- **Security:** No application permissions, no background jobs, runs under signed-in user identity

**Key trade-offs:**
- Version 1 prioritizes **speed, adoption, and consistency** over automated review scraping
- Links and optional summaries are sufficient for MVP
- Delegated-only permissions ensure proper audit trail and data governance
- Decoupled submission from analysis enables flexible processing options

---

## Narrative

### Today
- A GM notices a rating decline but cannot quickly identify root causes.
- Housekeeping, Engineering, and F&B hear complaints independently.
- Marketing content does not always match guest expectations.
- Central teams are asked to manually interpret reviews.

### Tomorrow
- GM opens an internal webpage, pastes required links, selects dates.
- Within minutes, receives:
  - Top positive and negative drivers (quantified)
  - OTA-specific operational risks
  - Top 5 prioritized actions (owner + timeline)
  - Reputation and conversion quick wins

---

## Goals

1. Enable hotels to submit required inputs in **under 5 minutes**
2. Produce a **usable, actionable report** without central intervention
3. Standardize guest feedback analysis across properties

### Metrics

#### North Star
- **Usable Report Rate**
  - Definition: Report includes themes + Top 5 actions with owners and passes internal QA
  - Target: **≥80%** during pilot

#### Secondary Metrics
- Form completion rate ≥70%
- Average completion time ≤5 minutes
- Successful report generation ≥95%
- Weekly active properties (pilot target: 10–20)

#### Guardrails
- Prompt exposure incidents: **0**
- Wrong-property match rate: **<2%**

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

## Non-Goals

- Automated scraping of Google or OTA reviews (v1)
- External/public access
- Task management or action tracking system
- Competitive benchmarking dashboards
- Perfect multilingual sentiment analysis
- Real-time analysis (decoupled submission from processing)
- Centralized submission database (user's OneDrive = user's data)

---

## Alternative Implementation: Localhost-Only Mode

If Entra ID App Registration is denied or delayed, the application can operate in **localhost-only mode** as a proof-of-concept.

### What Works in Localhost Mode

✅ **Full UI/UX Experience**
- All 4 wizard steps functional
- Complete form validation
- Mock dashboard with example data
- User can experience the full interface

✅ **Data Export Capability**
- Form submission generates JSON file
- User can download JSON to local filesystem
- JSON can be manually shared via email/Slack
- Enables manual analysis workflow

✅ **Development & Demo**
- Stakeholder demonstrations
- User acceptance testing (UAT)
- Training material creation
- Requirements validation

✅ **No IT Dependencies**
- No App Registration needed
- No Azure resources required
- Runs entirely in browser
- Zero infrastructure cost

### What Doesn't Work in Localhost Mode

❌ **No Cloud Storage**
- Cannot write to OneDrive/SharePoint
- No centralized submission repository
- Users must manually save/share files

❌ **No Authentication**
- Cannot verify user identity
- No audit trail of who submitted what
- Anyone with localhost access can use it

❌ **No Multi-User Deployment**
- Cannot be deployed to GitHub Pages (authentication would fail)
- Each user runs on their own machine
- No shared access to submissions

❌ **Manual Analysis Workflow**
- Users email/Slack the JSON file to analyst
- Analyst manually processes with AI prompt
- Report sent back via email
- No automated pipeline

### Localhost Mode Value Proposition

**Use Case:** Validate the intake form UX and data structure before investing in IT approvals.

**Process:**
1. User runs `npm run dev` on their laptop
2. Fills out the intake form
3. Downloads JSON file on submission
4. Sends JSON to analyst (you) via email
5. You manually process with Claude/ChatGPT
6. You send back analysis report
7. Iterate on prompt and data structure

**Pilot Metrics Achievable:**
- ✅ Form completion rate
- ✅ Average completion time
- ✅ Field validation effectiveness
- ✅ Usable report rate (manual analysis)
- ❌ Adoption rate (can't track without auth)
- ❌ Automated report generation rate

**Timeline Impact:**
- Localhost mode: Available immediately (0 days)
- With App Registration: +2-4 weeks for IT approval
- Full automation: +4-8 weeks for analysis pipeline

### Decision Framework

| Scenario | Recommended Approach |
|----------|---------------------|
| IT approval likely within 2 weeks | Wait for App Registration |
| IT approval uncertain or >4 weeks | Start with localhost, migrate later |
| Need to validate UX/data structure | Localhost pilot (5-10 hotels) |
| Need to prove business value first | Localhost + manual analysis |
| Ready for production scale | Full Microsoft Graph integration |

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

## Key Features

### Plan of Record (MVP)

1. **Internal Web Intake Form**
   - 4-step wizard
   - Required field enforcement
   - Progress indicator
   - Optional sections collapsed

2. **Validation & Safeguards**
   - Hotel name + brand + keyword enforcement
   - URL domain validation
   - Mismatch warnings

3. **Authentication & Permissions**
   - Entra ID sign-in (MSAL.js 2.0)
   - Delegated permissions only (Files.ReadWrite)
   - User consent flow on first use
   - Token refresh handling

4. **Submission & Storage**
   - Unique submission ID (timestamp-based)
   - JSON file written to user's OneDrive: `/intake_submissions/{hotel-name}_{timestamp}.json`
   - File contains: hotel metadata, date range, review URLs, keywords, social links
   - User can access their own submissions via OneDrive

5. **Analysis Processing** (Decoupled)
   - Offline retrieval of submission files
   - Hidden prompt execution (method TBD: manual, script, or automation)
   - Prompt logic never exposed to end users
   - Report generation and delivery

6. **Report Output**
   - Executive summary
   - Theme dashboard
   - OTA operational insights
   - Top 5 actions (14 days)
   - Delivered via email or OneDrive link

---

## Key Flows

### Flow 1: Happy Path
1. User opens intake page (GitHub Pages)
2. Clicks "Sign in with Microsoft" (Entra ID authentication)
3. Grants consent to Files.ReadWrite (first time only)
4. Enters hotel details and keywords
5. Selects date range
6. Pastes Google + TripAdvisor + OTA links
7. Optionally adds social links
8. Submits form
9. App writes JSON to user's OneDrive `/intake_submissions/` folder
10. User receives confirmation with submission ID
11. Separately, analysis is run and report delivered (email or OneDrive notification)

### Flow 2: Validation Errors
- Missing fields → inline errors
- Invalid URLs → domain warning
- Insufficient keywords → prompt to add variants

### Flow 3: Storage Failure
- If OneDrive write fails (network, permissions, quota):
  - User shown error message with retry option
  - Submission data preserved in browser localStorage as backup
  - User can retry submission or download JSON manually
  - Submission ID provided for support tracking

### Flow 4: Concurrent Submissions
- Each submission isolated via unique ID
- No overwrites

---

## Key Logic

### Required Fields
- Hotel name, brand, country, city/area
- Minimum 2 keywords
- Date range
- Google Maps + TripAdvisor URLs
- OTA selection + corresponding URLs

### Matching Rules
- Include only property-specific feedback
- Flag ambiguous mentions
- Report included vs excluded counts

### Prioritization Formula
