# 🌐 Bridgeloop — Competitive Intelligence Platform

> **Turn Public Data Into Your Competitive Edge.**
> Track competitor pricing, analyse sentiment, and receive AI-powered alerts — automatically.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-orange)
![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-EA4B71?logo=n8n)
![Playwright](https://img.shields.io/badge/Playwright-Stealth_Scraper-2EAD33?logo=playwright)

---

## ✨ What is Bridgeloop?

Bridgeloop is a full-stack AI-powered competitive intelligence platform that allows businesses to:

- 🔍 **Monitor competitor websites** using an autonomous stealth scraping engine
- 💰 **Track pricing changes** over time with beautiful trend charts
- 🧠 **Understand market sentiment** using Groq's Llama 3.1 LLM
- 🔔 **Receive instant alerts** when a competitor drops their price by more than 5%
- 📊 **Visualise everything** through a premium, dark-mode dashboard

---

## 🏗️ Architecture

Bridgeloop uses a **modern three-tier microservice architecture**:

```
┌──────────────────────┐     API calls      ┌────────────────────────┐
│  Next.js 16 Frontend │ ──────────────────▶ │  Python FastAPI Backend │
│  (Dashboard + UI)    │                     │  (Scraper + DB + CRUD)  │
└──────────────────────┘                     └──────────┬─────────────┘
                                                        │ MongoDB Atlas
                                                        ▼
                                             ┌────────────────────────┐
                                             │  n8n Orchestrator       │
                                             │  (Cron → Scrape → AI   │
                                             │   → Save → Alert)       │
                                             └──────────┬─────────────┘
                                                        │ Groq API (Llama 3.1)
                                                        ▼
                                             ┌────────────────────────┐
                                             │  MongoDB Atlas          │
                                             │  (Time-series storage)  │
                                             └────────────────────────┘
```

### Why this stack?

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend | Next.js 16 + Framer Motion | SSR, animations, premium UX |
| Backend | Python FastAPI | Async, fast, perfect for I/O-heavy scraping |
| Scraper | Playwright + playwright-stealth | Bypasses bot detection without paid proxies |
| Database | MongoDB Atlas | Flexible schema for unstructured scraped data |
| AI | Groq API (Llama 3.1) | 10x faster than OpenAI, generous free tier |
| Orchestration | n8n | Visual drag-and-drop workflow automation |
| Tunnel | ngrok | Exposes local FastAPI to n8n and browser |

---

## 🚀 Features

### 🎨 Landing Page
- Stunning 3D scroll-based canvas animation (192-frame sequence)
- Framer Motion scroll-driven text reveal ("Track. Compare. Grow.")
- GSAP word-by-word tagline animation
- Glassmorphism feature cards with 3D tilt on hover
- Interactive particle background
- Full dark/light mode support

### 📊 Dashboard
- **Overview** — KPI cards with live competitor count & price snapshots
- **Tracked Competitors** — Add/remove URLs to monitor with a modal form
- **Insights** — Live price trend charts, real sentiment scores, AI summaries
- **Catalogue** — Product catalogue management
- **Profile** — User profile details
- Real-time notification bell with dropdown alerts

---

## 🕵️ How the Stealth Scraper Works

### The Problem with Normal Scraping

If you use Python's `requests` library to fetch a webpage, the website instantly knows it's a bot because:
- The request has no real browser fingerprint
- `navigator.webdriver` is set to `true` — a dead giveaway
- No JavaScript execution, so React/Next.js pages render as empty HTML
- Sites like Cloudflare block it before you get a single byte of data

### Our Solution — Real Browser + Disguise

Instead of faking HTTP requests, we launch an **actual invisible Chromium browser** (the same engine Chrome uses) and then lie about what it is. Here's every step:

```
POST /scrape  {"url": "https://competitor.com/product"}
       │
       ▼
┌─────────────────────────────────────────────────┐
│  1. Launch real headless Chromium browser        │
│     (invisible window, full JS engine)           │
├─────────────────────────────────────────────────┤
│  2. playwright-stealth patches 15 properties     │
│     BEFORE any page loads:                       │
│     • navigator.webdriver      → hidden          │
│     • navigator.plugins        → fake Chrome list│
│     • navigator.platform       → "Win32"         │
│     • navigator.languages      → ["en-US", "en"] │
│     • navigator.hardwareConcurrency → 8 cores    │
│     • WebGL vendor/renderer    → spoofed         │
│     • chrome.runtime           → stubbed as real │
│     • sec-ch-ua headers        → real Chrome UA  │
├─────────────────────────────────────────────────┤
│  3. Navigate to URL, wait for DOM to load        │
│     • Executes all JavaScript (React sites work) │
│     • Handles cookies, redirects, lazy-loading   │
├─────────────────────────────────────────────────┤
│  4. Grab the full rendered HTML                  │
├─────────────────────────────────────────────────┤
│  5. BeautifulSoup strips all noise:              │
│     • Removes <script>, <style>, <svg> tags      │
│     • Removes noscript and hidden elements       │
│     • Extracts only human-readable text          │
├─────────────────────────────────────────────────┤
│  6. Truncate to 5,000 characters                 │
│     (saves LLM tokens and keeps costs at zero)   │
└─────────────────────────────────────────────────┘
       │
       ▼
  Clean text returned to n8n → sent to Groq AI
```

### Every Library Used & Why

| Library | Role | Why we chose it |
|---------|------|----------------|
| `playwright` | Controls real Chromium browser | Only way to execute JS and bypass bot checks |
| `playwright-stealth` | Patches 15 browser fingerprint properties | Makes Chromium look identical to a real human's Chrome |
| `beautifulsoup4` | HTML parsing and cleaning | Strips scripts/styles, extracts readable text efficiently |
| `FastAPI` | Wraps scraper in a REST API | Async — handles multiple scrape jobs concurrently |
| `motor` | Saves results to MongoDB | Async driver — doesn't block FastAPI while writing to DB |
| `python-dotenv` | Loads secrets from `.env` | Keeps API keys out of source code |

### Why It Works on Most Sites
Bot detection (including basic Cloudflare) works by running JavaScript that checks browser properties. Since `playwright-stealth` patches those properties **before the page loads**, every check passes. The only sites that can still detect us are those using mouse-movement tracking or image CAPTCHAs — rare for publicly listed pricing pages.

---

## 🤖 How n8n Orchestrates the AI Pipeline

n8n is a **visual drag-and-drop workflow engine** — think of it as the brain that coordinates everything on a schedule, without you writing any glue code.

### The Full Automated Workflow

```
Every night at midnight
       │
       ▼
┌──────────────────────────────┐
│  Node 1: Schedule Trigger    │
│  Fires the workflow on cron  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Node 2: HTTP Request        │
│  GET /track                  │
│  Fetches all competitor URLs │
│  you added in the dashboard  │
└──────────────┬───────────────┘
               │  returns array of items
               ▼
┌──────────────────────────────┐
│  Node 3: HTTP Request        │
│  POST /scrape                │
│  Passes each URL to our      │
│  stealth Playwright scraper  │
│  Returns 5,000 chars of text │
└──────────────┬───────────────┘
               │  clean text
               ▼
┌──────────────────────────────┐
│  Node 4: Groq Chat Model     │
│  Sends text to Llama 3.1     │
│  System prompt instructs it  │
│  to extract price, sentiment │
│  and summary as JSON         │
└──────────────┬───────────────┘
               │  {"price": 51.77, "sentiment": "positive", ...}
               ▼
┌──────────────────────────────┐
│  Node 5: HTTP Request        │
│  POST /history               │
│  Saves the extracted data    │
│  to MongoDB via FastAPI      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Node 6: (Optional) Email    │
│  Sends alert if price        │
│  dropped more than 5%        │
└──────────────────────────────┘
```

### Why n8n Instead of Writing Custom Code?

- **Visual** — you can see the entire pipeline at a glance and debug individual nodes
- **No infrastructure** — runs locally with a single `npx n8n` command, free forever
- **Built-in retry logic** — if a scrape fails, n8n retries automatically
- **Easy to extend** — add a Slack notification, Google Sheets export, or Telegram alert with one drag-and-drop node

---

## 🧠 How the Groq AI Extraction Works

Groq runs Meta's **Llama 3.1 8B** model at extremely high speed (up to 800 tokens/second) — roughly 10x faster than OpenAI's API, with a generous free tier.

### What We Ask It

We send the clean scraped text with a strict system prompt:

```
You are a product data extractor. Analyze the provided text from a product page.
Extract the price (as a float), overall sentiment (positive/neutral/negative),
and a 1-sentence summary.
Reply ONLY with a valid JSON object:
{"price": 51.77, "sentiment": "positive", "summary": "..."}
```

We use Groq's `response_format: { type: "json_object" }` parameter to **force** the output to always be valid JSON — no extra text, no markdown, just clean structured data we can immediately save to MongoDB.

### Example Real Output

Input (scraped text from books.toscrape.com):
```
A Light in the Attic | Books to Scrape — £51.77 — In stock — A classic
collection of poetry and drawings from Shel Silverstein...
```

Groq output:
```json
{
  "price": 51.77,
  "sentiment": "positive",
  "summary": "A classic collection of poetry by Shel Silverstein celebrating its 20th anniversary."
}
```

This gets saved to MongoDB and immediately appears in your Insights dashboard.

---

## 📁 Project Structure

```
bridgeloop/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout + ThemeProvider
│   │   ├── globals.css
│   │   ├── auth/                     # Authentication pages
│   │   └── dashboard/
│   │       ├── layout.tsx            # Sidebar + header layout
│   │       ├── page.tsx              # Dashboard overview
│   │       ├── tracked/page.tsx      # ✅ Live — Add/remove competitors
│   │       ├── insights/page.tsx     # ✅ Live — Real charts + AI data
│   │       ├── catalogue/page.tsx    # Product catalogue
│   │       ├── profile/page.tsx      # User profile
│   │       └── help/page.tsx         # Help centre
│   ├── components/
│   │   ├── ProductStory.tsx          # 3D scroll canvas animation
│   │   ├── FeatureReveal.tsx         # Parallax tilt feature cards
│   │   ├── BridgeloopTagline.tsx     # GSAP word reveal
│   │   ├── BackgroundParticles.tsx   # tsparticles background
│   │   ├── ThemeProvider.tsx         # next-themes wrapper
│   │   ├── ThemeToggle.tsx           # Dark/light toggle
│   │   └── NeonCursor.tsx            # Custom cursor effect
│   └── lib/
│       └── api.ts                    # ✅ Centralised FastAPI client
├── backend/
│   ├── main.py                       # FastAPI app + all endpoints
│   ├── test_pipeline.py              # End-to-end pipeline test script
│   ├── .env.example                  # Template for secrets
│   └── venv/                         # Python virtual environment (gitignored)
├── .env.local.example                # Template for Next.js env
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- Python 3.13+
- ngrok account (free) — [ngrok.com](https://ngrok.com)
- MongoDB Atlas account (free) — [mongodb.com/atlas](https://mongodb.com/atlas)
- Groq API key (free) — [console.groq.com](https://console.groq.com)
- n8n (local via npx)

---

### 1. Clone & Install Frontend

```bash
git clone https://github.com/Sneha31106/Bridgeloop.git
cd Bridgeloop
npm install
```

### 2. Setup Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install fastapi uvicorn playwright playwright-stealth beautifulsoup4 motor pymongo python-dotenv httpx groq
playwright install chromium
```

### 3. Configure Secrets

**Backend** — create `backend/.env` (copy from `.env.example`):
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

**Frontend** — create `.env.local` (copy from `.env.local.example`):
```env
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app
```

### 4. Start All Services

**Terminal 1 — FastAPI Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

**Terminal 2 — ngrok tunnel:**
```bash
ngrok config add-authtoken <your-ngrok-token>
ngrok http 8001
# Copy the https://xxxx.ngrok-free.app URL into .env.local
```

**Terminal 3 — n8n Workflow Engine:**
```bash
npx n8n
# Open http://localhost:5678
```

**Terminal 4 — Next.js Frontend:**
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/track` | Get all tracked competitors |
| `POST` | `/track` | Add a new competitor URL |
| `DELETE` | `/track/{id}` | Remove a tracked competitor |
| `GET` | `/history` | Get all price history (optionally filter by `tracked_item_id`) |
| `POST` | `/history` | Save a new price snapshot |
| `POST` | `/scrape` | Stealth-scrape a URL and return clean text |

---

## 🔒 Security

- All API keys stored in `.env` files — **never committed to git**
- `.gitignore` excludes `backend/.env`, `.env.local`, and `backend/venv/`
- CORS middleware configured on FastAPI
- ngrok provides HTTPS for all public-facing requests

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/) — React framework
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [GSAP](https://greensock.com/gsap/) — Scroll-triggered text animation
- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework
- [Playwright](https://playwright.dev/python/) — Browser automation
- [playwright-stealth](https://github.com/AtuboDad/playwright_stealth) — Bot detection evasion
- [Motor](https://motor.readthedocs.io/) — Async MongoDB driver
- [Groq](https://console.groq.com/) — Ultra-fast LLM inference
- [n8n](https://n8n.io/) — Workflow automation
- [Recharts](https://recharts.org/) — Data visualisation
- [Lucide React](https://lucide.dev/) — Icons

---

## 👥 Team

Built as a Capstone Project by **Bridgeloop Team**.

---

*"The best competitive intelligence is the kind that runs while you sleep."*
