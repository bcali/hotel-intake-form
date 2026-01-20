# Localhost Mode - Testing Checklist

## Pre-Flight Checklist

Before running tests, ensure:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5173/hotel-intake-form/`

---

## Functional Testing

### 1. Form Wizard - Step 1 (Property Information)

**Test: Required Field Validation**
- [ ] Leave "Hotel Name" empty → Click Next → Error appears
- [ ] Fill "Hotel Name" → Click Next → Error clears
- [ ] Leave "Brand" empty → Click Next → Error appears
- [ ] Leave "Country" empty → Click Next → Error appears
- [ ] Leave "City/Area" empty → Click Next → Error appears

**Test: Keywords (Now Optional)**
- [ ] Leave keywords empty → Click Next → Form advances (no error)
- [ ] Add 1 keyword → Click Next → Form advances
- [ ] Add 3 keywords → Click Next → Form advances

**Test: Local Language**
- [ ] Default value is "English" → Verify dropdown shows "English"
- [ ] Change to "Arabic" → Verify selected
- [ ] Change to "Thai" → Verify selected

**Expected Result:** Required fields enforced, keywords optional, navigation works

---

### 2. Form Wizard - Step 2 (Time Period)

**Test: Date Range Validation**
- [ ] Leave "Start Date" empty → Click Next → Error appears
- [ ] Leave "End Date" empty → Click Next → Error appears
- [ ] Set End Date before Start Date → Click Next → Error appears: "End date must be after start date"
- [ ] Set date range > 180 days → Click Next → Error appears: "Maximum 180 days"
- [ ] Set valid range (90 days) → Click Next → Form advances

**Test: Comparison Period**
- [ ] Default value is "Previous period" → Verify selected
- [ ] Change to "Previous year" → Verify selected
- [ ] Click Back button → Returns to Step 1

**Expected Result:** Date validation works, max 180 days enforced, back navigation works

---

### 3. Form Wizard - Step 3 (Review Sources)

**Test: Required URL Validation**
- [ ] Leave Google Maps URL empty → Click Next → Error appears
- [ ] Enter invalid URL (not Google Maps domain) → Error: "Must be a Google Maps URL"
- [ ] Enter valid Google Maps URL → Error clears
- [ ] Leave TripAdvisor URL empty → Click Next → Error appears
- [ ] Enter invalid URL (not TripAdvisor domain) → Error: "Must be a TripAdvisor URL"
- [ ] Enter valid TripAdvisor URL → Error clears

**Test: OTA Selection**
- [ ] Select "Booking.com" → URL field appears
- [ ] Leave Booking URL empty → Click Next → Error appears
- [ ] Enter invalid URL → Error: "Must be a Booking.com URL"
- [ ] Enter valid Booking URL → Error clears
- [ ] Select "Agoda" → URL field appears
- [ ] Deselect "Booking.com" → URL field disappears, value cleared

**Test: Optional Fields**
- [ ] Leave "Total Reviews" empty → Click Next → Form advances (no error)
- [ ] Enter "1250" in Total Reviews → Value accepted
- [ ] Leave "Average Rating" empty → Click Next → Form advances (no error)
- [ ] Enter "8.5" in Average Rating → Value accepted

**Expected Result:** URL domain validation works, OTA fields dynamic, optional fields skippable

---

### 4. Form Wizard - Step 4 (Social & Notes)

**Test: All Fields Optional**
- [ ] Leave all fields empty → Click Submit → Form submits
- [ ] Enter Instagram URL → Value accepted
- [ ] Enter Facebook URL → Value accepted
- [ ] Enter TikTok URL → Value accepted
- [ ] Enter YouTube URL → Value accepted

**Test: Internal Notes Sections**
- [ ] Expand "Top Guest Issues" → Text area appears
- [ ] Collapse "Top Guest Issues" → Text area hides
- [ ] Enter text in "Recent Changes Notes" → Value saved
- [ ] Enter text in "Additional Context" → Value saved

**Test: Navigation**
- [ ] Click Back button → Returns to Step 3
- [ ] Click Submit button → Proceeds to submission

**Expected Result:** All fields optional, collapsible sections work, navigation functions

---

## Submission & Download Testing

### 5. Form Submission

**Test: JSON File Download**
- [ ] Complete all 4 steps with sample data
- [ ] Click "Submit" on Step 4
- [ ] JSON file downloads automatically to Downloads folder
- [ ] File name format: `{hotel-name}_{timestamp}.json`
- [ ] Open JSON file → Valid JSON structure
- [ ] Verify all form data present in JSON

**Test: Confirmation Screen**
- [ ] After submission, confirmation screen appears
- [ ] Green checkmark icon visible
- [ ] Hotel name displayed correctly
- [ ] Submission ID shown (format: `submission-{timestamp}`)
- [ ] "Localhost Mode Active" indicator visible at bottom

**Expected Result:** JSON downloads automatically, confirmation screen displays correctly

---

### 6. localStorage Backup

**Test: Submission Backup**
- [ ] After submission, open browser DevTools → Application → Local Storage
- [ ] Verify key `lastSubmission` exists
- [ ] Value is valid JSON matching form data
- [ ] Verify key `lastSubmissionId` exists
- [ ] Value matches submission ID on confirmation screen

**Test: Re-download Functionality**
- [ ] On confirmation screen, click "Download Submission Again"
- [ ] JSON file downloads again
- [ ] File content matches original submission
- [ ] Works even after page refresh (localStorage persists)

**Expected Result:** Submission backed up to localStorage, re-download works

---

## Auto-Save & Draft Testing

### 7. Draft Auto-Save

**Test: Automatic Draft Saving**
- [ ] Start fresh (clear localStorage if needed)
- [ ] Fill Step 1 → Enter hotel name
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify key `formDraft` exists with hotel name
- [ ] Fill Step 2 → Enter dates
- [ ] Refresh localStorage view → Dates now in `formDraft`
- [ ] Navigate to Step 3, Step 4 → All data auto-saved

**Test: Draft Restoration**
- [ ] Fill Steps 1-2 with data
- [ ] Refresh browser page (F5)
- [ ] Form restores to Step 1 with data intact
- [ ] Navigate to Step 2 → Dates restored
- [ ] All form data persisted across refresh

**Expected Result:** Every field change auto-saves, draft restores on page reload

---

### 8. Manual Save Draft

**Test: "Save & continue later" Button**
- [ ] Fill Step 1 partially
- [ ] Scroll to bottom → Click "Save & continue later"
- [ ] Alert appears: "Draft saved successfully!"
- [ ] Click OK → Alert closes
- [ ] Close browser tab
- [ ] Reopen `http://localhost:5173/hotel-intake-form/`
- [ ] Form data restored

**Test: Draft Persistence Across Sessions**
- [ ] Fill form halfway
- [ ] Close browser completely
- [ ] Reopen browser and navigate to app
- [ ] Draft restored (same browser)
- [ ] Open in different browser → Fresh form (browser-specific)

**Expected Result:** Manual save works, draft persists across browser sessions (same browser)

---

## Edge Cases & Error Handling

### 9. Edge Case Testing

**Test: Empty Form Submission Attempt**
- [ ] Start fresh form
- [ ] Try to click Next on Step 1 without filling anything
- [ ] All required field errors appear simultaneously
- [ ] Form does not advance

**Test: Browser localStorage Full**
- [ ] (Hard to test - requires filling localStorage to quota)
- [ ] Check browser console for warnings if save fails
- [ ] App should continue functioning even if localStorage fails

**Test: Special Characters in Hotel Name**
- [ ] Enter hotel name: "Park Regis (Dubai) - Deira & Bur Dubai!"
- [ ] Submit form
- [ ] Downloaded filename sanitized: `park-regis--dubai----deira---bur-dubai-_{timestamp}.json`
- [ ] JSON content preserves original name exactly

**Test: Very Long Text Fields**
- [ ] Enter 500+ characters in "Additional Context" notes
- [ ] Submit form
- [ ] JSON file contains full text
- [ ] No truncation occurs

**Expected Result:** Edge cases handled gracefully, data integrity maintained

---

### 10. Localhost Mode Banner

**Test: Environment Indicator**
- [ ] On any wizard step, banner visible at top
- [ ] Text: "Localhost Mode: Your submission will be downloaded as a JSON file"
- [ ] Blue pulsing dot animation visible
- [ ] Banner disappears on confirmation screen (replaced by footer indicator)

**Test: Confirmation Screen Localhost Indicator**
- [ ] After submission, scroll to bottom of confirmation screen
- [ ] Green dot + "Localhost Mode Active" visible
- [ ] Subtitle: "This is a proof-of-concept version..."

**Expected Result:** Clear visual indicators that app is in localhost mode

---

## Mock Dashboard Testing

### 11. Dashboard Preview

**Test: Dashboard Navigation**
- [ ] Complete form submission
- [ ] On confirmation screen, click "View Mock Dashboard Preview"
- [ ] Dashboard loads with sample data
- [ ] Hotel name from form displayed in header
- [ ] Keywords from form displayed in theme lists
- [ ] Back navigation not available (single-use flow)

**Test: Dashboard Components**
- [ ] KPI strip displays 4 metrics (Health, Reviews, Sentiment, Rating)
- [ ] Positive Drivers section shows 5 themes
- [ ] Negative Drivers section shows 5 themes
- [ ] Top 5 Actions table populated
- [ ] OTA Comparison chart visible
- [ ] All interactive elements render without errors

**Expected Result:** Dashboard displays mock data correctly, no console errors

---

## User Experience Testing

### 12. UX & Accessibility

**Test: Keyboard Navigation**
- [ ] Tab through all form fields in order
- [ ] Tab reaches "Next" button
- [ ] Press Enter on "Next" → Form advances
- [ ] Tab through dropdown (Local Language) → Arrow keys work
- [ ] Shift+Tab goes backward through fields

**Test: Visual Feedback**
- [ ] Click in empty required field → No error yet (waiting for submit attempt)
- [ ] Try to submit → Error appears with red border
- [ ] Fill field → Error disappears immediately
- [ ] Error icon (AlertCircle) appears next to error message
- [ ] All errors styled consistently

**Test: Responsive Design**
- [ ] Resize browser to mobile width (375px) → Form remains usable
- [ ] Resize to tablet width (768px) → Layout adjusts
- [ ] Resize to desktop (1920px) → Centered, max-width applied
- [ ] All text readable at all sizes

**Expected Result:** Good keyboard support, clear error states, responsive layout

---

## Performance Testing

### 13. Performance & Load Times

**Test: Initial Load**
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Page loads in <2 seconds
- [ ] No console errors
- [ ] Vite dev server HMR working (file changes reflect instantly)

**Test: Form Responsiveness**
- [ ] Type in text field → No lag
- [ ] Add/remove keywords → Immediate update
- [ ] Click Next → Transitions smoothly
- [ ] No memory leaks (check DevTools Memory tab after 10+ submissions)

**Test: Large JSON File**
- [ ] Fill all fields with maximum data
- [ ] Add 10+ keywords
- [ ] Add all OTAs
- [ ] Fill all notes fields with paragraphs
- [ ] Submit → JSON downloads successfully
- [ ] File size reasonable (<100KB)

**Expected Result:** Fast, responsive, no performance issues

---

## Browser Compatibility

### 14. Cross-Browser Testing

**Test in Chrome:**
- [ ] All features work
- [ ] JSON download works
- [ ] localStorage works
- [ ] No console errors

**Test in Firefox:**
- [ ] All features work
- [ ] JSON download works
- [ ] localStorage works
- [ ] No console errors

**Test in Edge:**
- [ ] All features work
- [ ] JSON download works
- [ ] localStorage works
- [ ] No console errors

**Test in Safari (Mac/iOS):**
- [ ] All features work
- [ ] JSON download works (Safari has stricter download policies)
- [ ] localStorage works
- [ ] No console errors

**Expected Result:** Works in all modern browsers (Chrome, Firefox, Edge, Safari)

---

## Integration Testing

### 15. End-to-End User Journey

**Complete User Flow:**
1. [ ] User opens `http://localhost:5173/hotel-intake-form/`
2. [ ] Sees localhost mode banner
3. [ ] Fills Step 1: Property info (hotel name, brand, country, city)
4. [ ] Clicks Next → Advances to Step 2
5. [ ] Fills Step 2: Date range (start, end, comparison)
6. [ ] Clicks Back → Returns to Step 1 with data intact
7. [ ] Clicks Next → Returns to Step 2
8. [ ] Clicks Next → Advances to Step 3
9. [ ] Fills Step 3: Google Maps URL, TripAdvisor URL, selects Booking.com
10. [ ] Fills Booking.com URL
11. [ ] Clicks Next → Advances to Step 4
12. [ ] Fills Step 4: Instagram URL, adds internal note
13. [ ] Clicks "Save & continue later" → Alert confirms save
14. [ ] Refreshes page → Draft restored
15. [ ] Navigates back to Step 4
16. [ ] Clicks Submit → JSON downloads
17. [ ] Sees confirmation screen with submission ID
18. [ ] Clicks "Download Submission Again" → File downloads again
19. [ ] Clicks "View Mock Dashboard Preview" → Dashboard loads
20. [ ] Verifies hotel name and keywords appear in dashboard
21. [ ] Scrolls through all dashboard sections

**Expected Result:** Entire user journey works flawlessly without errors

---

## Test Results Summary

### Completion Checklist
- [ ] All Step 1 tests passed
- [ ] All Step 2 tests passed
- [ ] All Step 3 tests passed
- [ ] All Step 4 tests passed
- [ ] Submission & download tests passed
- [ ] localStorage tests passed
- [ ] Auto-save tests passed
- [ ] Edge case tests passed
- [ ] Localhost mode indicators tested
- [ ] Dashboard preview tested
- [ ] UX & accessibility tested
- [ ] Performance tested
- [ ] Cross-browser tested
- [ ] End-to-end flow tested

### Issues Found
*(Document any bugs or issues discovered during testing)*

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
| Example: Keywords validation allows empty array | Low | Leave keywords empty, click Next | Fixed |
|  |  |  |  |

### Test Environment
- **Node.js Version:** _________
- **Browser(s) Tested:** _________
- **Operating System:** _________
- **Date Tested:** _________
- **Tester:** _________

---

## Pilot User Acceptance Testing

### For Real Hotel Pilot (5-10 Properties)

**Pre-Pilot:**
- [ ] Test all features above
- [ ] Fix all critical/high severity bugs
- [ ] Prepare training materials
- [ ] Set up analyst email/process

**During Pilot:**
- [ ] Track form completion rate
- [ ] Measure average completion time
- [ ] Collect user feedback on confusion points
- [ ] Monitor JSON file quality (valid structure)
- [ ] Track analyst processing time

**Post-Pilot:**
- [ ] Survey users (UX satisfaction)
- [ ] Review analyst feedback (report quality)
- [ ] Identify missing form fields
- [ ] Document feature requests
- [ ] Make go/no-go decision for cloud integration

---

## Sign-Off

**Tested By:** _________________________

**Date:** _________________________

**Status:** ☐ Ready for Pilot  ☐ Needs Fixes  ☐ Blocked

**Notes:**
