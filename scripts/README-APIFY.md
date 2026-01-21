# Apify Integration Guide

**Automated review fetching for analysts**

---

## Overview

This script automates the tedious process of manually copying reviews from Google Maps, TripAdvisor, and Booking.com. Instead, it uses Apify actors to scrape reviews and generate analysis-ready input files.

**Cost:** ~$0.50-2.00 per hotel (depending on review volume)
**Time saved:** ~20-30 minutes per hotel

---

## Prerequisites

### 1. Apify Account

1. Sign up at https://apify.com/
2. Go to Settings → Integrations → API tokens
3. Copy your API token (starts with `apify_api_...`)

**Free tier:** $5 credit (enough for 3-5 hotels)
**Paid plan:** ~$49/month for 100+ hotels

### 2. Install Dependencies

```bash
cd hotel-intake-form/scripts
npm install apify-client
```

### 3. Set API Token

**On Mac/Linux:**
```bash
export APIFY_API_TOKEN="apify_api_your_token_here"
```

**On Windows (PowerShell):**
```powershell
$env:APIFY_API_TOKEN="apify_api_your_token_here"
```

**On Windows (CMD):**
```cmd
set APIFY_API_TOKEN=apify_api_your_token_here
```

**Permanent (add to `.bashrc` or `.zshrc`):**
```bash
echo 'export APIFY_API_TOKEN="apify_api_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

---

## Usage

### Basic Command

```bash
node fetch-reviews-apify.js <path-to-submission.json>
```

### Example

```bash
# Navigate to scripts folder
cd d:/Users/bclark/hotel-intake-form/scripts

# Run script
node fetch-reviews-apify.js ../downloads/anantara-siam_1768896171188.json
```

### What Happens

1. **Script reads submission JSON** (hotel info, URLs, date range)
2. **Calls Apify actors** for Google Maps, TripAdvisor, Booking.com
3. **Fetches up to 50 reviews** per source (configurable)
4. **Saves two files:**
   - `anantara-siam_1768896171188_reviews.json` (structured data)
   - `anantara-siam_1768896171188_reviews.txt` (AI-ready format)

### Output Example

**Console output:**
```
✅ Loaded submission: Anantara Siam

📍 Fetching Google Maps reviews...
   ✅ Fetched 42 reviews

🏖️  Fetching TripAdvisor reviews...
   ✅ Fetched 38 reviews

🏨 Fetching Booking.com reviews...
   ✅ Fetched 29 reviews

✅ Review data saved to: anantara-siam_1768896171188_reviews.json
✅ Analysis input saved to: anantara-siam_1768896171188_reviews.txt

📊 Total reviews fetched: 109

🎉 Done! You can now use the _reviews.txt file with the analysis prompt.
```

**Generated `_reviews.txt` file:**
```
================================================================================
HOTEL SUBMISSION + REVIEW DATA FOR AI ANALYSIS
================================================================================

SUBMISSION DATA:
{
  "id": "submission-1768896171187",
  "property": {
    "hotelName": "Anantara Siam",
    ...
  }
}

--------------------------------------------------------------------------------

GOOGLE MAPS REVIEWS (42 reviews):

Review 1:
Rating: 5/5
Date: 2026-01-18
Author: John Smith
Text: Amazing hotel! Staff was incredibly helpful...

Review 2:
Rating: 2/5
Date: 2026-01-15
Author: Jane Doe
Text: Disappointed. AC in room didn't work...

[... all reviews ...]

--------------------------------------------------------------------------------

TRIPADVISOR REVIEWS (38 reviews):

Review 1:
Rating: 4/5
Date: 2026-01-17
Author: TravellerJohn
Title: Great location but noisy
Subratings: {"Service":5,"Cleanliness":4,"Location":5,"Value":3,"Sleep Quality":3}
Text: Great location and service. Room was clean but...

[... all reviews ...]

--------------------------------------------------------------------------------

BOOKING.COM REVIEWS (29 reviews):

Review 1:
Score: 8.5/10
Date: 2026-01-16
Author: Anonymous
Category Scores: {"Cleanliness":9,"Comfort":7,"Location":10,"Facilities":8,"Staff":9,"Value":7,"WiFi":6}
Positive: Lovely hotel in great location. Staff very friendly.
Negative: Bed was a bit hard. WiFi needs improvement.

[... all reviews ...]

--------------------------------------------------------------------------------

Total reviews: 109
Fetched at: 2026-01-20T10:15:30.123Z
================================================================================
```

---

## Updated Analyst Workflow

### Old Way (Manual - 45-80 min per hotel)

1. Receive JSON submission
2. **Manually visit Google Maps URL** → Copy 20 reviews (10 min)
3. **Manually visit TripAdvisor URL** → Copy 15 reviews (8 min)
4. **Manually visit Booking.com URL** → Copy 18 reviews (8 min)
5. Format all reviews into analysis input (5 min)
6. Paste into Claude with prompt
7. Generate report

**Total time:** 45-80 minutes
**Cost:** $0 (your labor)

### New Way (Automated - 15-30 min per hotel)

1. Receive JSON submission
2. **Run script:** `node fetch-reviews-apify.js submission.json` (2-3 min automated)
3. Open generated `_reviews.txt` file
4. Paste into Claude with prompt
5. Generate report

**Total time:** 15-30 minutes (30-50 min saved!)
**Cost:** ~$0.50-2 per hotel

---

## Configuration

### Change Max Reviews Per Source

Edit `fetch-reviews-apify.js`:

```javascript
const MAX_REVIEWS_PER_SOURCE = 50; // Change to 30, 100, etc.
```

**Cost impact:**
- 50 reviews per source = ~$1.50 per hotel
- 30 reviews per source = ~$1.00 per hotel
- 100 reviews per source = ~$3.00 per hotel

### Filter by Date Range

The script fetches recent reviews. To filter by date:

```javascript
// In fetchGoogleMapsReviews function
const run = await client.actor(ACTORS.googleMaps).call({
  startUrls: [{ url }],
  maxReviews: MAX_REVIEWS_PER_SOURCE,
  reviewsSort: 'newest',
  language: 'en',
  // Add date filter (Apify actor dependent)
});
```

**Note:** Date filtering support varies by Apify actor. Most actors fetch "newest" by default.

---

## Troubleshooting

### Error: `APIFY_API_TOKEN environment variable not set`

**Solution:**
```bash
export APIFY_API_TOKEN="your_token_here"
```

Verify it's set:
```bash
echo $APIFY_API_TOKEN
```

### Error: `Cannot find module 'apify-client'`

**Solution:**
```bash
cd scripts
npm install apify-client
```

### Error: `Apify actor run failed`

**Possible causes:**
- Invalid URL (check submission JSON)
- Apify account out of credits
- Actor rate limited (wait a few minutes)

**Solution:**
- Check Apify dashboard: https://console.apify.com/
- Verify URL is valid (visit it in browser)
- Check credit balance

### Reviews are in wrong language

**Solution:**
Edit script and change `language` parameter:

```javascript
language: 'en'  // Change to 'th', 'ar', etc.
```

### Too expensive

**Solutions:**
1. Reduce `MAX_REVIEWS_PER_SOURCE` to 30
2. Only fetch Google Maps (comment out TripAdvisor/Booking)
3. Use free tier for pilot, switch to paid after proving ROI

---

## Cost Analysis

### Pilot (5-10 hotels, 50 reviews each)

| Source | Reviews | Cost per hotel | Total (10 hotels) |
|--------|---------|----------------|-------------------|
| Google Maps | 50 | $0.50 | $5.00 |
| TripAdvisor | 50 | $0.75 | $7.50 |
| Booking.com | 50 | $0.75 | $7.50 |
| **Total** | **150** | **$2.00** | **$20.00** |

**Apify free tier:** $5 credit = 2-3 hotels
**Paid plan:** $49/month = ~25-30 hotels

### Break-Even Analysis

**Analyst hourly rate:** $30/hour
**Time saved:** 30 min per hotel
**Value saved:** $15 per hotel

**If processing 10 hotels:**
- Manual cost: 10 hotels × $15 = $150 (your time)
- Automated cost: $20 (Apify) + $30 (analyst time for 10 hotels × 15 min)
- **Savings: $100**

**ROI:** 200% for 10 hotels

---

## Advanced: Batch Processing

Process multiple submissions at once:

```bash
# Create batch script
for file in ../downloads/*.json; do
  echo "Processing $file..."
  node fetch-reviews-apify.js "$file"
done
```

**Windows PowerShell:**
```powershell
Get-ChildItem ../downloads/*.json | ForEach-Object {
  Write-Host "Processing $_..."
  node fetch-reviews-apify.js $_.FullName
}
```

---

## Alternative: Use Apify Web Interface

If you prefer not to use command line:

1. Go to https://console.apify.com/
2. Navigate to "Actors" → Search for "Google Maps Scraper"
3. Click "Try for free"
4. Paste URL manually
5. Set `maxReviews: 50`
6. Click "Start"
7. Download results as JSON
8. Repeat for TripAdvisor, Booking

**Pros:** Visual interface, no coding
**Cons:** Manual for each source, slower

---

## Next Steps

1. **Test with one hotel** to verify it works
2. **Check Apify credit balance** after test
3. **Adjust MAX_REVIEWS_PER_SOURCE** based on cost/quality trade-off
4. **Run pilot** with 5-10 hotels
5. **Measure time savings** vs. manual approach
6. **Calculate ROI** to justify ongoing cost

---

## Support

**Apify Issues:**
- Documentation: https://docs.apify.com/
- Support: support@apify.com

**Script Issues:**
- Check GitHub issues
- Contact analyst team lead

---

**Version:** 1.0
**Last Updated:** 2026-01-20
**Maintained by:** Analyst Team
