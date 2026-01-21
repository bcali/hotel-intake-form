# Analyst Workflow Guide - Manual Analysis

**For:** Analysts processing hotel submission JSON files
**Version:** 1.0 (Localhost Mode)
**Last Updated:** 2026-01-20

---

## Overview

This guide shows you how to process JSON submission files from the hotel intake form and generate analysis reports using AI tools (Claude, ChatGPT, etc.).

**Typical turnaround:** 30-60 minutes per hotel (depending on review volume)

---

## Step-by-Step Process

### Step 1: Receive Submission

You'll receive a JSON file via email or shared folder with a filename like:
```
anantara-siam_1768896171188.json
```

**Save it to a dedicated folder** (e.g., `C:/Hotel-Submissions/Inbox/`)

---

### Step 2: Open and Review JSON

Open the file to extract key details:

**Example JSON:**
```json
{
  "id": "submission-1768896171187",
  "timestamp": "2026-01-20T08:02:51.187Z",
  "property": {
    "hotelName": "Anantara Siam",
    "brand": "Anantara",
    "country": "Thailand",
    "cityArea": "Bangkok",
    "keywords": [],
    "localLanguage": "English"
  },
  "timePeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-20",
    "comparisonPeriod": "none"
  },
  "reviewSources": {
    "googleMaps": "https://www.google.com/...",
    "tripAdvisor": "https://www.tripadvisor.com/...",
    "selectedOTAs": ["booking"],
    "otaUrls": {
      "booking": "https://www.booking.com/..."
    }
  },
  "socialLinks": {},
  "internalNotes": {}
}
```

**Quick Check:**
- ✅ Hotel name and location present
- ✅ Date range valid (20 days in this example)
- ✅ At least 2 review sources (Google + TripAdvisor + Booking.com)
- ⚠️ No keywords provided (optional, but helpful for validation)
- ⚠️ No internal notes (optional context)

---

### Step 3: Gather Review Data

**IMPORTANT:** The AI cannot fetch reviews from URLs automatically. You need to provide review text.

#### Option A: Manual Export (Recommended)

**Google Maps/Google Business:**
1. Visit the Google Maps URL
2. Scroll through reviews
3. Copy/paste recent reviews (or use browser extension)
4. Aim for: 20-50 most recent reviews in date range

**TripAdvisor:**
1. Visit the TripAdvisor URL
2. Filter by date range (Jan 1 - Jan 20, 2026)
3. Copy review text + ratings
4. Note subratings if available

**Booking.com:**
1. Visit the Booking URL
2. Look for "Guest reviews" section
3. Copy recent reviews (especially negative ones)
4. Note category scores (Cleanliness, Comfort, Staff, etc.)

#### Option B: Review Scraping Tools (Advanced)

If you have access to scraping tools:
- Use tools like Outscraper, Apify, or custom scripts
- Export as CSV or JSON
- Import into a single document

#### Option C: Hotel Provides Summaries

If hotel provides:
- Review exports from platforms
- Internal summary documents
- Guest feedback reports

---

### Step 4: Prepare Analysis Input

Create a **combined input document** with:

1. **The original JSON file contents**
2. **Review text data** from all sources
3. **Any additional context** (internal notes, recent changes, etc.)

**Example format:**

```
SUBMISSION DATA:
{paste entire JSON here}

---

GOOGLE MAPS REVIEWS (20 reviews, Jan 1-20, 2026):

Review 1:
Rating: 5/5
Date: Jan 18, 2026
Text: "Amazing hotel! Staff was incredibly helpful, especially at check-in. Room was spacious and clean. Pool area is beautiful. Only minor issue was WiFi was slow in the room."

Review 2:
Rating: 2/5
Date: Jan 15, 2026
Text: "Disappointed. AC in room didn't work properly for 2 days. Called front desk multiple times but took forever to get someone to fix it. Hotel looks nice but basic maintenance is lacking."

[... continue for all reviews]

---

TRIPADVISOR REVIEWS (15 reviews, Jan 1-20, 2026):

Review 1:
Rating: 4/5
Date: Jan 17, 2026
Service: 5/5, Cleanliness: 4/5, Location: 5/5, Value: 3/5, Sleep Quality: 3/5
Text: "Great location and service. Room was clean but heard noise from hallway. Breakfast was excellent. Bit pricey for what you get."

[... continue for all reviews]

---

BOOKING.COM REVIEWS (18 reviews, Jan 1-20, 2026):

Review 1:
Score: 8.5/10
Date: Jan 16, 2026
Cleanliness: 9, Comfort: 7, Location: 10, Facilities: 8, Staff: 9, Value: 7, WiFi: 6
Text: "Lovely hotel in great location. Staff very friendly. Bed was a bit hard for my preference. WiFi needs improvement."

[... continue for all reviews]

---

INTERNAL NOTES:
[Paste any additional context from hotel team]
```

---

### Step 5: Run AI Analysis

#### Using Claude (Recommended)

1. **Open Claude.ai** (or Claude Desktop app)
2. **Start a new conversation** or use a dedicated Project
3. **Paste the analysis prompt:**
   - Copy the entire contents of `ANALYSIS-PROMPT.md`
   - Paste into Claude
4. **Paste your combined input:**
   - Add the submission JSON + review data prepared in Step 4
5. **Submit and wait** (typically 30-60 seconds)

#### Using ChatGPT

1. **Open ChatGPT** (GPT-4 recommended)
2. **Start a new chat**
3. **Paste the analysis prompt** from `ANALYSIS-PROMPT.md`
4. **Paste your combined input**
5. **Submit and wait**

#### Pro Tips

- **Use Claude Projects** for consistent analysis:
  - Create a project called "Hotel Review Analysis"
  - Add the `ANALYSIS-PROMPT.md` as project knowledge
  - Each new submission is a new chat in the project

- **For large datasets** (>100 reviews):
  - Use Claude's longer context window
  - Or split into batches (e.g., by source or month)

---

### Step 6: Review AI Output

The AI will generate a report following the format in `ANALYSIS-PROMPT.md`:

**Check for completeness:**
- ✅ Executive Summary (5 bullets)
- ✅ Theme Dashboard (ranked table)
- ✅ OTA Operational Insights
- ✅ Top 5 Actions (with clear steps, owners, metrics)
- ✅ Mid-Term Actions
- ✅ Reputation & Conversion Quick Wins
- ✅ Competitive Intelligence
- ✅ Review Response Templates
- ✅ Appendix (methodology, counts, excluded examples)

**Quality check:**
- Are themes quantified (counts, percentages)?
- Do actions have clear owners and steps?
- Are priority scores calculated?
- Are representative quotes included?
- Is the tone GM-friendly (concise, actionable)?

---

### Step 7: Format and Refine

**Copy AI output to a document:**
- Microsoft Word (recommended for distribution)
- Google Docs
- PDF

**Add branding:**
- Company logo
- Header/footer with hotel name and date
- Professional formatting

**Optional refinements:**
- Add visual elements (charts, icons)
- Highlight critical actions in red/yellow/green
- Include photos from reviews (if available)
- Add executive summary on cover page

---

### Step 8: Deliver Report

**Email to hotel contact:**

```
Subject: Anantara Siam - Guest Feedback Analysis Report (Jan 1-20, 2026)

Dear [GM Name],

Please find attached your Voice of Guest Analysis Report for Anantara Siam covering the period January 1-20, 2026.

Key highlights:
• Overall sentiment: 78% positive (based on 53 reviews)
• Top priority: AC maintenance issues (18% of negative reviews)
• Biggest opportunity: Leverage strong service reputation in marketing

The report includes:
- Top 5 immediate actions (next 14 days) with clear owners
- Mid-term improvement roadmap
- OTA-specific operational insights
- Review response templates for top issues

Please let me know if you have any questions or need clarification on any recommendations.

Best regards,
[Your Name]
Analyst, Guest Experience Insights

Attachment: Anantara-Siam_Report_Jan2026.pdf
```

**File organization:**
- Save report to: `C:/Hotel-Submissions/Completed/2026-01/Anantara-Siam/`
- Archive original JSON: Same folder
- Keep review data: Same folder (for reference)

---

### Step 9: Track Metrics

For each submission, track:

| Metric | Value | Notes |
|--------|-------|-------|
| Submission received | 2026-01-20 08:02 | Timestamp from JSON |
| Analysis completed | 2026-01-20 09:15 | Your completion time |
| Processing time | 1h 13min | Target: <2 hours |
| Review count | 53 reviews | Google: 20, TA: 15, Booking: 18 |
| Report delivered | 2026-01-20 09:30 | Email sent |
| Hotel feedback | TBD | Follow up in 1 week |

---

## Real-World Example Walkthrough

### Submission: Anantara Siam Bangkok

Let me show you exactly what to do with the sample JSON you provided:

#### 1. **Extract Key Info**

```
Hotel: Anantara Siam
Brand: Anantara
Location: Bangkok, Thailand
Date Range: Jan 1-20, 2026 (20 days)
Sources: Google Maps, TripAdvisor, Booking.com
Submission ID: submission-1768896171187
```

#### 2. **Gather Reviews**

**For this hotel, you'd need to:**

**Google Maps:**
- Visit: https://www.google.com/travel/search?q=anantara%20siam...
- Look for recent reviews from Jan 1-20, 2026
- Copy ~20 most recent reviews with ratings and dates

**TripAdvisor:**
- Visit: https://www.tripadvisor.com/Hotel_Review-g293916-d301884...
- Filter by "Most Recent"
- Check date range matches Jan 1-20, 2026
- Copy ~15 recent reviews
- Note subratings: Service, Cleanliness, Location, Value, Sleep Quality

**Booking.com:**
- Visit: https://www.booking.com/hotel/th/anantara-siam-bangkok...
- Scroll to "Guest reviews"
- Filter by date if possible
- Copy ~15-20 recent reviews
- Note category scores if visible

#### 3. **Create Analysis Input**

**Paste into Claude:**

```
I have a hotel review analysis submission. Please analyze according to the provided prompt.

SUBMISSION DATA:
{
  "id": "submission-1768896171187",
  "timestamp": "2026-01-20T08:02:51.187Z",
  "property": {
    "hotelName": "Anantara Siam",
    "brand": "Anantara",
    "country": "Thailand",
    "cityArea": "Bangkok",
    "keywords": [],
    "localLanguage": "English"
  },
  "timePeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-20",
    "comparisonPeriod": "none"
  },
  "reviewSources": {
    "googleMaps": "[URL]",
    "tripAdvisor": "[URL]",
    "selectedOTAs": ["booking"],
    "otaUrls": {
      "booking": "[URL]"
    }
  },
  "socialLinks": {},
  "internalNotes": {}
}

---

GOOGLE MAPS REVIEWS (Jan 1-20, 2026):

[Paste all Google reviews here with ratings and text]

---

TRIPADVISOR REVIEWS (Jan 1-20, 2026):

[Paste all TripAdvisor reviews here with ratings and text]

---

BOOKING.COM REVIEWS (Jan 1-20, 2026):

[Paste all Booking reviews here with scores and text]
```

#### 4. **Expected Output**

Claude will generate a report like:

```
# Voice of Guest + Social Listening Report
Hotel: Anantara Siam | Brand: Anantara
Location: Bangkok, Thailand
Period: January 1-20, 2026
Sources analyzed: Google Maps (20), TripAdvisor (15), Booking.com (18) = 53 total
Submission ID: submission-1768896171187
Matching summary: Included 53 | Excluded 0

---

## Executive Summary

1. **Overall Sentiment:** 78% positive, 15% neutral, 7% negative (across 53 reviews)
2. **Rating Trend:** Google: 4.6/5 | TripAdvisor: 4.5/5 | Booking.com: 8.9/10 (no comparison data available)
3. **Top 3 Negative Drivers:**
   - AC/HVAC issues (8 mentions, 15% of reviews)
   - WiFi connectivity (6 mentions, 11%)
   - Room soundproofing (5 mentions, 9%)
4. **Top 3 Positive Drivers:**
   - Staff service quality (32 mentions, 60%)
   - Location/accessibility (28 mentions, 53%)
   - Breakfast quality (22 mentions, 42%)
5. **Biggest Booking Risk:** AC maintenance complaints visible across all OTAs | **Biggest Opportunity:** Leverage exceptional staff reputation in marketing and response templates

---

## Theme Dashboard (Ranked by Priority Score)

| Rank | Theme | Mentions | % | Sources | Sentiment | Severity | Trend | Booking Impact | Owner | Priority Score |
|------|-------|----------|---|---------|-----------|----------|-------|----------------|-------|----------------|
| 1 | AC/HVAC Issues | 8 | 15% | G, T, B | 100% neg | High (5) | N/A | High (5) | Engineering | 200 |
| 2 | WiFi Connectivity | 6 | 11% | G, T, B | 100% neg | Medium (3) | N/A | Medium (3) | IT/Engineering | 54 |
| 3 | Room Soundproofing | 5 | 9% | G, B | 100% neg | Medium (3) | N/A | Medium (3) | Engineering | 45 |
| 4 | Staff Service (Positive) | 32 | 60% | All | 100% pos | N/A | N/A | High (5) | Front Office | Strength |
| 5 | Location (Positive) | 28 | 53% | All | 100% pos | N/A | N/A | High (5) | Marketing | Strength |

Representative quotes:
- **AC/HVAC Issues:** _"AC didn't work for first 2 days. Called reception 3 times before someone came."_ (Booking.com, Jan 15)
- **Staff Service:** _"Staff went above and beyond. Remembered our names and preferences throughout stay."_ (Google, Jan 18)

---

## Top 5 Actions (Next 14 Days)

**Action 1: Emergency AC Audit & Response Protocol**
- **Why:** AC issues mentioned 8 times (15% of reviews). Severity: High. Booking Impact: High. Appears across all platforms.
- **What to Do:**
  1. Engineering: Complete AC audit of all rooms by Day 3 (test cooling, thermostats, filters)
  2. Front Office: Implement 1-hour response SLA for AC complaints (escalation to Director on Duty if not met)
  3. Housekeeping: Add AC pre-check to turnover checklist
  4. Management: Daily AC complaint log for 30 days
- **Owner:** Director of Engineering (lead) + Front Office Manager (escalation)
- **Expected Guest Impact:** Working AC + fast resolution if issues occur
- **Expected Review Impact:** Reduce AC mentions by 70% in next period; potential +0.2 rating lift
- **How to Measure:** Track AC review mentions monthly; monitor complaint logs; check Google/Booking ratings

[... continue for Actions 2-5]

---

[... rest of the report sections]
```

---

## Troubleshooting

### Issue: No Review Text Available

**Problem:** Hotel only provided URLs, no actual review content.

**Solution:**
1. Inform hotel: "Need review exports to complete analysis"
2. Provide export instructions for each platform
3. Or: Offer to manually collect reviews (charge extra time)

### Issue: Reviews in Local Language

**Example:** Thai reviews for Bangkok hotel

**Solution:**
- Use Claude's multilingual capabilities
- Paste reviews in original language
- Claude will translate and analyze
- Note any cultural context in report

### Issue: Too Many Reviews (>100)

**Problem:** Analysis takes too long or exceeds context limits.

**Solution:**
1. **Sample approach:** Select most recent 50-70 reviews
2. **Batch approach:** Analyze by source (Google → TA → Booking → combine)
3. **Time period split:** Analyze first half vs. second half separately

### Issue: Incomplete JSON Data

**Problem:** Missing required fields (e.g., no hotel name, no URLs)

**Solution:**
1. Contact hotel for missing info
2. If urgent: Proceed with available data, note limitations in report
3. Add disclaimer: "Analysis limited by incomplete submission data"

---

## Pro Tips for Faster Processing

### 1. Use Templates and Snippets

Create saved snippets for:
- Email response templates
- Report cover page formatting
- Common analysis instructions for AI

### 2. Batch Processing

If you receive multiple submissions:
- Process similar hotels together
- Use consistent formatting
- Share learnings across similar properties

### 3. Build a Review Library

For recurring hotels:
- Keep historical data
- Compare current vs. previous periods
- Track improvement over time

### 4. Automate Where Possible

Consider:
- Browser extensions for review collection
- Scripts for JSON parsing
- Report templates with auto-fill fields

---

## Quality Checklist

Before sending report, verify:

- [ ] Hotel name, brand, location correct
- [ ] Date range matches JSON
- [ ] All review sources analyzed
- [ ] Themes quantified (counts, %)
- [ ] Top 5 actions have clear owners and steps
- [ ] Priority scores calculated
- [ ] Representative quotes included
- [ ] Report is GM-friendly (no jargon, concise)
- [ ] Formatting is professional
- [ ] Attachments included (if applicable)
- [ ] Email sent to correct contact

---

## Estimated Time per Submission

| Task | Time | Notes |
|------|------|-------|
| Review JSON | 2-3 min | Quick validation |
| Collect review data | 15-30 min | Depends on platform access |
| Prepare combined input | 5-10 min | Copy/paste and format |
| Run AI analysis | 1-2 min | Claude processing time |
| Review and refine output | 10-15 min | Quality check |
| Format report | 10-15 min | Word doc, branding |
| Email delivery | 3-5 min | Draft and send |
| **Total** | **45-80 min** | **Target: <1 hour per hotel** |

---

## Next Steps

1. **Try it yourself:** Process the Anantara Siam submission
2. **Refine the prompt:** Adjust based on output quality
3. **Create templates:** Speed up recurring tasks
4. **Track metrics:** Monitor your processing speed
5. **Gather feedback:** Ask hotels if reports are actionable

---

**Questions?** Refer to:
- [ANALYSIS-PROMPT.md](./ANALYSIS-PROMPT.md) - Full AI prompt
- [LOCALHOST-USAGE-GUIDE.md](./LOCALHOST-USAGE-GUIDE.md) - End-user guide
- [PRD.md](./PRD.md) - Product requirements

**Version:** 1.0 | **Last Updated:** 2026-01-20
