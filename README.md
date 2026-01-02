# 🏨 Hotel Voice of Guest Intake & Action Plan Generator

An internal tool designed for hotel teams to transform fragmented guest feedback into prioritized, departmental action plans.

[Live Demo](https://bcali.github.io/hotel-intake-form/) | [Product Requirements (PRD)](./PRD.md) | [GM Strategy Deck](https://gamma.app/docs/q7rs4knnhdr6eky)

## 🌟 Overview
This application provides a streamlined intake experience for hotel GMs and department heads. By collecting public listing links (Google, TripAdvisor, OTAs) and property context, it enables automated analysis that generates a structured, hotel-ready improvement plan.

## ✨ Key Features
- **4-Step Wizard:** Simple, intuitive intake for property info, dates, and links.
- **Smart Validation:** URL domain enforcement and keyword validation.
- **Action Dashboard:** 
  - **KPIs:** Sentiment, Volume, Rating, and Response trends.
  - **Sentiment Drivers:** Top positive and negative themes.
  - **Prioritized Actions:** 14-day roadmap with departmental owners.
  - **OTA Comparison:** Performance benchmarking across platforms.
- **GM-Ready Reports:** Executive summaries designed for leadership.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** GitHub Pages & Actions
- **Analysis (Backend):** Power Automate & Hidden AI Prompts (MVP logic)

## 🚀 Getting Started

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/bcali/hotel-intake-form.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Deployment
This project is configured for automated deployment to GitHub Pages via GitHub Actions. Any push to the `main` branch will trigger a build and deploy.

## 📄 Documentation
- [Full Product Requirements Document (PRD)](./PRD.md)
- [Hotel GM Strategy Presentation](https://gamma.app/docs/q7rs4knnhdr6eky)

---
*Internal use only for hotel property management teams.*
