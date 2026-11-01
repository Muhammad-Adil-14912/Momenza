# MOMENZA — Make Every Moment Matter.
*An intelligent luxury AI-powered event planning platform for weddings, milestones, and corporate celebrations.*

---

## 🌟 Product Vision
MOMENZA is a full-stack, production-quality AI event concierge. It acts as a personal event architect: hosts describe their vision, location, guest count, and budget in natural language, and MOMENZA generates an editable, comprehensive 10-pillar event plan.

### Core Brand Identity
* **Tagline**: *"Make Every Moment Matter."*
* **Personality**: Elegant, Minimal, Sophisticated, Warm, Premium, Intelligent
* **Aesthetic**: Luxury editorial design, quiet neutral ivory canvas (`#FAF9F6`), warm terracotta (`#C47B62`), soft sage (`#A7B29A`), and serif typography (*Playfair Display* & *Inter*).

---

## ✨ Flagship Capabilities & Differentiators

1. **Split-Screen AI Planning Workspace**:
   * Natural language event prompts (e.g. *"I want to organize a wedding in Lucknow for 300 guests with a budget of ₹8 lakh"*).
   * Generates a 10-point plan: Overview, Budget Breakdown, Preparation Timeline, Scenography & Decor, Gourmet Catering, Vendor Requirements, Guest Strategy, Entertainment, and Risk Contingency.
2. **Dynamic Event Replanning**:
   * Change budget (e.g. from ₹8L to ₹6L) or guest count at any time—MOMENZA recalculates affected allocations and provides an instant diff summary without requiring you to recreate the event.
3. **Smart Budget Optimizer**:
   * Interactive Donut chart with Terracotta & Sage palettes.
   * Compares estimated expenses against total budget and suggests realistic, high-impact savings with 1-click apply.
4. **MOMENZA Concierge (Global AI Drawer)**:
   * Accessible via the floating sparkle emblem across every page.
   * Reads the active event's context (e.g., *"How can I reduce my wedding budget by ₹20,000?"*, *"Suggest decorations under ₹15,000"*).
5. **Moodboard Gallery**:
   * Curated visual inspirations (*Awadhi Royal Heritage*, *Minimalist Editorial Romance*, *Sun-Drenched Garden Celebration*, etc.) with color swatches, floral pairings, and table setting concepts.
6. **Timeline & Milestone Checklist**:
   * Phased roadmap from 3 months out down to the hour of celebration day.
7. **Guest Management with CSV Import/Export**:
   * Track RSVPs, +1s, dietary requirements, and table numbers.
8. **Luxury PDF Export**:
   * One-click download of a high-resolution, branded event itinerary document.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**:
  * React 19 + Vite 8
  * Tailwind CSS v4 (`@tailwindcss/vite`)
  * React Router v7
  * Lucide React Icons
  * Recharts (Donut & Financial Visualizations)
  * Framer Motion & Canvas Confetti
  * jsPDF & html2canvas (PDF Generator)
* **Backend**:
  * Node.js & Express.js (ES Modules)
  * MongoDB Atlas (Mongoose) + Resilient Local Persistence Engine
  * Google Gemini API (`@google/generative-ai` with high-fidelity domain heuristics fallback)
  * JWT & Firebase Authentication support
  * bcryptjs password hashing

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js v18+ (tested on Node v24)
* npm v10+

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
* Backend runs on: `http://localhost:5000`
* Environment configuration is located in `server/.env`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 🔑 Environment Configuration (`server/.env`)

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
# Optional: Connect to your MongoDB Atlas cluster (if omitted, seamlessly runs in resilient local persistent mode)
MONGODB_URI=
# Optional: Add Google Gemini API Key for live AI model queries (if omitted, uses intelligent domain simulation engine)
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

---

*MOMENZA — A little less planning. A lot more celebrating.*
