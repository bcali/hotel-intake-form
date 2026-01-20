# 🏨 Hotel Voice of Guest Intake & Action Plan Generator

An internal tool designed for hotel teams to transform fragmented guest feedback into prioritized, departmental action plans.

**Current Mode:** 🟢 **Localhost Mode** (Proof of Concept)

[Live Demo](https://bcali.github.io/hotel-intake-form/) | [Product Requirements (PRD)](./PRD.md) | [Localhost Usage Guide](./LOCALHOST-USAGE-GUIDE.md) | [GM Strategy Deck](https://gamma.app/docs/q7rs4knnhdr6eky)

## 🌟 Overview
This application provides a streamlined intake experience for hotel GMs and department heads. By collecting public listing links (Google, TripAdvisor, OTAs) and property context, it enables automated analysis that generates a structured, hotel-ready improvement plan.

### Current Implementation: Localhost Mode

The application is currently running in **localhost mode** - a proof-of-concept version designed to:
- ✅ Validate UX and form design with real users
- ✅ Generate structured submission JSON files for manual analysis
- ✅ Enable pilot testing without IT infrastructure dependencies
- ✅ Build business case for full cloud integration

**What works:** Complete 4-step wizard, validation, auto-save, JSON download
**What's manual:** File sharing and AI analysis processing

See the [Localhost Usage Guide](./LOCALHOST-USAGE-GUIDE.md) for complete details.

## ✨ Key Features

### Currently Available (Localhost Mode)
- **4-Step Wizard:** Simple, intuitive intake for property info, dates, and links
- **Smart Validation:** URL domain enforcement, date range validation, required field checking
- **Auto-Save:** Automatic draft saving to browser localStorage
- **JSON Export:** Automatic download of structured submission data
- **Mock Dashboard:** Preview of analysis results with sample data

### Planned (Cloud Integration)
- **Microsoft Graph Integration:** Automatic OneDrive storage with Entra ID authentication
- **Automated Analysis:** AI-powered review analysis with hidden prompts
- **Action Dashboard:**
  - **KPIs:** Sentiment, Volume, Rating, and Response trends
  - **Sentiment Drivers:** Top positive and negative themes
  - **Prioritized Actions:** 14-day roadmap with departmental owners
  - **OTA Comparison:** Performance benchmarking across platforms
- **GM-Ready Reports:** Automated executive summaries designed for leadership

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS v3
- **Icons:** Lucide React
- **Storage (Current):** Browser localStorage + JSON file download
- **Storage (Planned):** Microsoft Graph API (OneDrive, delegated permissions)
- **Authentication (Planned):** MSAL.js 2.0 with Entra ID
- **Analysis (Current):** Manual processing with AI tools
- **Analysis (Planned):** Automated pipeline with hidden prompts
- **Deployment:** GitHub Pages & Actions (production), localhost (current)

## 🚀 Getting Started

### Localhost Mode (Current - Proof of Concept)

**Quick Start:**
```bash
# 1. Clone the repository
git clone https://github.com/bcali/hotel-intake-form.git
cd hotel-intake-form

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to: http://localhost:5173/hotel-intake-form/
```

**What to expect:**
- Complete the 4-step intake wizard
- Form validates in real-time
- On submission, a JSON file downloads automatically
- Share the JSON file with your analyst for manual processing
- Analyst returns analysis report (typically within 24 hours)

See the [Localhost Usage Guide](./LOCALHOST-USAGE-GUIDE.md) for complete instructions.

### Cloud Deployment (Planned)

When Microsoft Graph App Registration is approved:
- Users sign in with Entra ID
- Submissions auto-save to OneDrive
- Analysis pipeline processes automatically
- Reports delivered via email/OneDrive

Timeline: +2-4 weeks after IT approval

## 📄 Documentation
- **[Localhost Usage Guide](./LOCALHOST-USAGE-GUIDE.md)** - How to use localhost mode
- **[Full Product Requirements Document (PRD)](./PRD.md)** - Product specs and architecture
- **[Localhost Assessment](./LOCALHOST-ASSESSMENT.md)** - Technical capabilities analysis
- **[Hotel GM Strategy Presentation](https://gamma.app/docs/q7rs4knnhdr6eky)** - Business case

## 🧪 Testing Localhost Mode

### Quick Test (2 minutes)
1. Start dev server: `npm run dev`
2. Fill Step 1 with any hotel details
3. Fill Step 2 with date range (max 180 days)
4. Fill Step 3 with sample URLs (validation checks domains)
5. Fill Step 4 (all optional)
6. Click Submit
7. Check Downloads folder for JSON file
8. Click "Download Submission Again" to test localStorage backup

### Pilot Test (Real Hotel)
1. Gather hotel's review platform URLs
2. Complete all 4 steps with real data
3. Download JSON file
4. Email to analyst: `analysis@yourcompany.com`
5. Analyst processes with AI tools
6. Receive report within 24 hours
7. Provide feedback on form UX and report quality

---
*Internal use only for hotel property management teams.*
