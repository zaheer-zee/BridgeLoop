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

### 🤖 AI Pipeline (via n8n)
1. **Cron Trigger** fires at midnight
2. **Fetch** all tracked URLs from FastAPI (`GET /track`)
3. **Stealth Scrape** each URL using Playwright Chromium (bot detection bypassed)
4. **AI Extraction** via Groq Llama 3.1 — extracts price, sentiment, summary
5. **Save** results to MongoDB (`POST /history`)
6. **Alert** if price dropped >5% (email node)

### 🕵️ Stealth Scraper
- Uses **Playwright** with **playwright-stealth** to mask all bot fingerprints
- Hides `navigator.webdriver`, spoofs user agent, platform, and hardware concurrency
- Handles JavaScript-rendered pages (React/Next.js competitor sites)
- Cleans HTML with BeautifulSoup — strips scripts, styles, SVGs
- Truncates to 5,000 characters to optimise LLM token usage

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
