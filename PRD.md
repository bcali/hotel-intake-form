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

On submission, a **Power Automate backend** executes a **hidden analysis prompt** and generates a **GM-ready action report**, stored in OneDrive and accessible to internal teams.

**Key trade-off:**  
Version 1 prioritizes **speed, adoption, and consistency** over automated review scraping. Links and optional summaries are sufficient for MVP.

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

3. **Submission & Storage**
   - Unique submission ID
   - JSON stored in `/intake_submissions/`
   - Report stored in `/reports/`

4. **Hidden Prompt Execution**
   - Power Automate HTTP endpoint
   - Prompt stored server-side only

5. **Report Output**
   - Executive summary
   - Theme dashboard
   - OTA operational insights
   - Top 5 actions (14 days)

---

## Key Flows

### Flow 1: Happy Path
1. User opens intake page
2. Enters hotel details and keywords
3. Selects date range
4. Pastes Google + TripAdvisor + OTA links
5. Optionally adds social links
6. Submits form
7. Receives link to generated report

### Flow 2: Validation Errors
- Missing fields → inline errors
- Invalid URLs → domain warning
- Insufficient keywords → prompt to add variants

### Flow 3: Backend Failure
- Submission saved
- User shown retry option and submission ID

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
