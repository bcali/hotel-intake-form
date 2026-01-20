# Localhost Mode - Usage Guide

## Overview

This application is currently running in **localhost mode** - a proof-of-concept version that allows you to test the full intake form and download submission files without requiring cloud infrastructure or IT approvals.

## How It Works

### 1. **Fill Out the Form**
- Complete all 4 steps of the intake wizard
- All validation rules apply (required fields, URL validation, etc.)
- Your progress auto-saves to browser localStorage

### 2. **Submit & Download**
When you click "Submit" on the final step:
- Your submission data is packaged into a JSON file
- The file automatically downloads to your Downloads folder
- A backup is saved to browser localStorage
- You'll see a confirmation screen with your submission ID

### 3. **Share Your Submission**
After download, you have several options:
- **Email:** Send the JSON file to your analyst via email
- **Shared Folder:** Upload to a shared OneDrive/Google Drive folder
- **Slack/Teams:** Share directly in your team channel
- **Manual Processing:** Analyst will run AI analysis manually

### 4. **Receive Your Report**
- Analyst processes your JSON file with AI analysis tools
- You receive an action plan report (typically within 24 hours)
- Report includes themes, priorities, OTA insights, and quick wins

## Features Available in Localhost Mode

### ✅ What Works

| Feature | Status | Notes |
|---------|--------|-------|
| 4-Step Wizard | ✅ Fully functional | Complete UX experience |
| Form Validation | ✅ All rules enforced | Real-time error checking |
| Data Collection | ✅ Complete JSON | All fields captured |
| Auto-Save Draft | ✅ Working | Saves to browser localStorage |
| JSON Download | ✅ Automatic | Downloads on submission |
| Mock Dashboard | ✅ Available | Preview of analysis results |
| Re-download File | ✅ Working | Retrieve from localStorage |

### ❌ What Doesn't Work

| Feature | Status | Alternative |
|---------|--------|-------------|
| Cloud Storage | ❌ Not available | Manual file download |
| User Authentication | ❌ No Entra ID | No user identity tracking |
| Automated Analysis | ❌ Manual process | Analyst runs AI manually |
| Email Notifications | ❌ Not implemented | Manual communication |
| Submission History | ❌ No database | Keep local copies |
| Multi-User Access | ❌ Localhost only | Each user runs separately |

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git (optional, for cloning)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository (or download ZIP)
git clone https://github.com/bcali/hotel-intake-form.git
cd hotel-intake-form

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at: `http://localhost:5173`

### First-Time Setup (5 minutes)

1. **Open the app** in your browser
2. **Test with sample data:**
   - Hotel: "Park Regis Kris Kin"
   - Brand: "Park Regis"
   - Country: "United Arab Emirates"
   - City: "Dubai - Deira"
   - Keywords: Park Regis, Kris Kin, PARQ
   - Dates: Any 180-day range
   - URLs: Paste real review platform URLs
3. **Submit the form**
4. **Check your Downloads folder** for the JSON file
5. **View the mock dashboard** to see sample analysis results

## JSON File Format

When you submit the form, a file is downloaded with this structure:

```json
{
  "id": "submission-1737398400000",
  "timestamp": "2026-01-20T14:30:00.000Z",
  "property": {
    "hotelName": "Park Regis Kris Kin",
    "brand": "Park Regis",
    "country": "United Arab Emirates",
    "cityArea": "Dubai - Deira",
    "keywords": ["Park Regis", "Kris Kin", "PARQ"],
    "localLanguage": "Arabic"
  },
  "timePeriod": {
    "startDate": "2025-10-01",
    "endDate": "2026-01-15",
    "comparisonPeriod": "previous-period"
  },
  "reviewSources": {
    "googleMaps": "https://maps.app.goo.gl/...",
    "tripAdvisor": "https://www.tripadvisor.com/...",
    "selectedOTAs": ["booking", "agoda"],
    "otaUrls": {
      "booking": "https://www.booking.com/...",
      "agoda": "https://www.agoda.com/..."
    },
    "totalReviews": "1250",
    "averageRating": "8.2"
  },
  "socialLinks": {
    "instagram": "https://www.instagram.com/parkregiskriskin",
    "facebook": "https://www.facebook.com/parkregiskriskin"
  },
  "internalNotes": {
    "topGuestIssues": "AC issues in rooms",
    "recentChanges": "yes",
    "recentChangesNotes": "Lobby renovation Dec 2025",
    "additionalNotes": "Focus on OTA ratings"
  }
}
```

**File Naming:**
- Format: `{hotel-name}_{timestamp}.json`
- Example: `park-regis-kris-kin_1737398400000.json`

## Save & Continue Later

### Auto-Save (Automatic)
- Every field change is auto-saved to browser localStorage
- Refresh the page - your data persists
- Close browser and reopen - your draft is restored

### Manual Save
- Click "Save & continue later" at the bottom of any step
- Confirmation alert appears
- Draft saved with current step number
- Return later and pick up where you left off

### Important Notes
- Drafts are saved **per browser**
- Clearing browser data will delete drafts
- Incognito/Private mode doesn't persist data
- Switching browsers = fresh start

## Manual Analysis Workflow

### For Hotel Staff (Submitters)

1. **Complete the intake form** (5 min)
2. **Download the JSON file** (automatic)
3. **Email to analyst:**
   ```
   Subject: Hotel Analysis Request - [Hotel Name]

   Hi [Analyst Name],

   Please find attached my submission for hotel review analysis.

   Hotel: [Hotel Name]
   Submission ID: [ID from confirmation screen]
   Date Range: [Start] to [End]

   Thanks!
   ```
4. **Wait for report** (typically 24 hours)

### For Analysts (Processors)

1. **Receive JSON file** via email/shared folder
2. **Open your AI tool** (Claude, ChatGPT, etc.)
3. **Paste your analysis prompt** (hidden from hotels)
4. **Paste the JSON data**
5. **Add instruction:** "Generate hotel action plan based on this submission"
6. **Review AI output:**
   - Top themes
   - Priority actions
   - OTA insights
   - Quick wins
7. **Format as report** (PDF, Word, etc.)
8. **Email to hotel contact**

### Batch Processing (Efficient for Multiple Submissions)

```bash
# If you receive 5-10 submissions per day:
# 1. Create a folder: /submissions-YYYY-MM-DD/
# 2. Save all JSON files to folder
# 3. Use Claude Projects or ChatGPT custom instructions
# 4. Process each file (copy/paste)
# 5. Save outputs to /reports-YYYY-MM-DD/
# 6. Email all reports at end of day
```

## Troubleshooting

### Issue: File didn't download

**Possible causes:**
- Browser blocked the download (check browser notifications)
- Disk full
- Browser permissions not granted

**Solutions:**
1. Check browser's download settings
2. Click "Download Submission Again" on confirmation screen
3. File is backed up in localStorage - contact support

### Issue: Lost my submission file

**Solution:**
1. Return to confirmation screen (refresh if still open)
2. Click "Download Submission Again"
3. File is retrieved from browser localStorage

### Issue: Draft not restoring

**Possible causes:**
- Switched browsers
- Cleared browser data
- Used incognito mode

**Solution:**
- Draft is browser-specific
- Check if you're in the same browser
- Click "Save & continue later" frequently

### Issue: Form validation not working

**Solution:**
1. Check required fields (marked with *)
2. Ensure URLs match expected domains
3. Date range must be ≤180 days
4. Keywords field is optional (can be empty)

## Pilot Program Recommendations

### For a 5-10 Hotel Pilot

**Week 1: Setup & Training**
- Install Node.js on pilot users' laptops
- Clone repo and run `npm install`
- 30-minute training session (walkthrough)
- Test submission with sample data

**Week 2-3: Data Collection**
- Hotels submit at their own pace
- Set expectation: 24-hour report turnaround
- Collect user feedback (UX, confusion points)
- Track metrics (completion time, errors)

**Week 4: Review & Iterate**
- Analyze metrics
- User satisfaction survey
- Identify pain points
- Refine prompt based on report quality
- Decision: Scale or pivot

### Metrics to Track

| Metric | How to Measure | Target |
|--------|----------------|--------|
| Form completion rate | Submissions / Started sessions | ≥70% |
| Avg completion time | User self-report | ≤5 min |
| Usable report rate | GM rating (1-5 scale) | ≥80% give 4+ |
| Field validation errors | Count error messages shown | <5% of fields |
| JSON format issues | Invalid JSON files received | 0% |

## Migration to Cloud (Future)

When IT approves Microsoft Graph integration:

### What Changes for Users
- **Before (Localhost):** Download JSON file manually
- **After (Cloud):** File auto-saves to OneDrive, no download needed

### What Changes for Analysts
- **Before:** Manual email collection
- **After:** Centralized OneDrive folder, all submissions in one place

### Timeline
- **Localhost setup:** 0 days (immediate)
- **Cloud migration:** 2-3 weeks after IT approval
- **User retraining:** Minimal (same form, different backend)

## FAQ

**Q: Can I deploy this to GitHub Pages in localhost mode?**
A: No. Localhost mode requires local file download, which only works on `localhost`. Deploy after Microsoft Graph integration.

**Q: How many hotels can use localhost mode?**
A: Recommended: 5-10 tech-savvy users. Each needs Node.js installed and knows how to run `npm run dev`.

**Q: Is my data secure in localhost mode?**
A: Data stays on your local machine and in browser localStorage. No cloud transmission. Share files at your discretion.

**Q: Can I access my submissions from another computer?**
A: No. localStorage is browser-specific. Keep JSON files if you need access elsewhere.

**Q: What happens if I clear my browser data?**
A: Drafts and backup submissions are deleted. Keep downloaded JSON files safe.

**Q: Can the analyst see my form while I'm filling it out?**
A: No. They only see the JSON file you send them after submission.

**Q: How do I know if my submission was successful?**
A: You'll see a green confirmation screen and a file in your Downloads folder. Check for the submission ID.

**Q: Can I edit a submission after downloading?**
A: No. The JSON file is read-only. To make changes, submit a new form (it will generate a new file with new timestamp).

## Support & Feedback

### Getting Help
- **Technical issues:** Check troubleshooting section above
- **Form questions:** See inline help text in each step
- **Analysis questions:** Contact your assigned analyst

### Providing Feedback
During the pilot, please share feedback on:
- Form clarity (were any fields confusing?)
- Validation issues (did errors make sense?)
- Missing fields (what information was needed but not captured?)
- Report quality (was the analysis actionable?)
- Process friction (what slowed you down?)

### Contact
- **Email:** [your-contact-email]
- **Slack:** #hotel-feedback-pilot
- **Issues:** File bug reports at GitHub repo

---

**Version:** Localhost Mode (Proof of Concept)
**Last Updated:** 2026-01-20
**Status:** ✅ Operational for pilot testing
