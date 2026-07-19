<div align="center">

<img src="https://img.shields.io/badge/DiscoveryOS-Product%20Intelligence-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNSIvPjwvc3ZnPg==" />

# DiscoveryOS

### **Turn customer noise into product signal — automatically.**

DiscoveryOS ingests your support tickets, interview recordings, app reviews, and survey CSVs, then surfaces what actually matters: ranked pain points, AI-generated roadmaps, and executive reports — in seconds, not weeks.

<br/>

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

[**Live Demo**](#) · [**Docs**](#) · [**Report a Bug**](https://github.com/MrAbhishekA279784/DiscoveryOS/issues) · [**Request a Feature**](https://github.com/MrAbhishekA279784/DiscoveryOS/issues)

</div>

---

## The Problem

Product teams spend 40–60% of discovery time manually reading feedback. By the time they synthesize insights, the window to act has closed. DiscoveryOS eliminates that lag.

---

## What It Does

```
You upload messy feedback  →  AI extracts signal  →  You ship the right things faster
```

| Without DiscoveryOS | With DiscoveryOS |
|---|---|
| 3 hours reading 1,200 reviews | 30 seconds to indexed insights |
| "I think users are frustrated with sync" | "Database Sync failures: 432 reports (33.6% of total)" |
| Roadmap based on loudest voice in the room | Roadmap prioritised by customer volume × developer effort |
| Quarterly reports built in Notion + Excel | One-click PDF / PPTX export |

---

## Key Features

### 🧠 AI Copilot
Chat with your data. Ask "What are the top friction points for Enterprise users?" and get a structured answer with confidence scores, cited sources, and TypeScript code recommendations — all grounded in your actual documents.

### 📊 Insights Dashboard
Live KPI cards track Total Feedbacks, Detected Pain Points, Positive/Negative Signal ratios, and a Net Sentiment Score. Feedback clusters are displayed with percentage breakdowns and a real-time trend chart.

### 🗺️ AI Product Roadmap
The AI reads your clustered pain points and generates a prioritised roadmap with quarterly milestones, confidence scores, effort estimates, and dependency risk alerts. Export directly to Jira or Linear with one click.

### 🔬 Research Mode
Run semantic queries across all indexed documents simultaneously. Each session shows research progress, confidence score, documents used, and follow-up suggestions.

### 📂 Data Ingestion Hub
Drag-and-drop upload or connect live integrations — no pipeline engineering required.

**File uploads:** PDF, DOCX, CSV, XLSX, TXT, MP4, MP3

**Native integrations:**
- **Google Drive** — team folders, interview transcripts, research briefs
- **Notion** — product specs, epic trackers, draft roadmaps
- **Jira** — crash tickets, bug backlogs, customer escalations
- **Slack** — beta tester channels, support pipelines (real-time)
- **Linear** — engineering issue sync

### 📑 Reports Hub
Compile an Executive Report with one click. Export as a polished PowerPoint vector presentation, a structured PDF, or a raw CSV feedback index — all from the same view.

### 🔐 Authentication
Firebase Authentication with Google OAuth, JWT-protected API routes, and multi-tenant workspace isolation.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React 19 + TypeScript                 │
│   Landing Page · Dashboard · Research · Insights        │
│   Roadmap · AI Copilot · Reports · Projects · Settings  │
└────────────────────┬────────────────────────────────────┘
                     │  REST + Streaming
┌────────────────────▼────────────────────────────────────┐
│                 FastAPI (Python)                         │
│  /auth  /uploads  /analytics  /copilot  /search         │
│  /reports  /projects  /datasources  /workspaces         │
└──────┬──────────────┬──────────────────┬────────────────┘
       │              │                  │
┌──────▼──────┐ ┌─────▼──────┐  ┌───────▼───────┐
│ PostgreSQL  │ │ Gemini AI  │  │ Firebase Auth │
│ (Supabase) │ │  + NLP     │  │ + JWT Tokens  │
│ 19 tables  │ │  Pipeline  │  │               │
└─────────────┘ └────────────┘  └───────────────┘
```

---

## Tech Stack

**Frontend** — React 19, TypeScript 5, Vite 6, Tailwind CSS 4, Framer Motion, GSAP, Lucide React

**Backend** — FastAPI 0.115, Python, asyncpg, SQLAlchemy, Pydantic, structlog

**Database** — PostgreSQL via Supabase (19 tables, 5 migration files, indexed for text search)

**Auth** — Firebase Authentication, Google OAuth 2.0, PyJWT

**AI** — Gemini API (`@google/genai`), custom NLP pipeline for theme extraction and sentiment classification

**Export** — jsPDF (PDF generation), PPTX vector pipeline, CSV export

---

## Project Structure

```
DiscoveryOS/
│
├── frontend/                       # React app
│   ├── src/
│   │   ├── components/             # 16 page-level components
│   │   │   ├── InsightsView.tsx
│   │   │   ├── ResearchView.tsx
│   │   │   ├── AiCopilotView.tsx
│   │   │   ├── RoadmapView.tsx
│   │   │   ├── ReportsView.tsx
│   │   │   ├── ProjectsView.tsx
│   │   │   ├── DataSourcesView.tsx
│   │   │   └── ...
│   │   ├── landing/                # Public landing page (GSAP animated)
│   │   ├── auth/                   # Firebase auth flows + protected routes
│   │   ├── utils/                  # 14 custom React hooks (useDashboard, useCopilot, ...)
│   │   └── types.ts                # Shared TypeScript interfaces
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                        # FastAPI app
│   ├── app/
│   │   ├── main.py                 # App entry point, CORS, router registration
│   │   ├── auth.py                 # JWT middleware
│   │   ├── database.py             # asyncpg connection pool
│   │   ├── config.py               # Pydantic settings
│   │   ├── routers/                # 11 API routers
│   │   │   ├── analytics.py
│   │   │   ├── copilot.py
│   │   │   ├── uploads.py
│   │   │   ├── reports.py
│   │   │   └── ...
│   │   ├── models/                 # SQLAlchemy models
│   │   └── utils/                  # NLP + file parsing utilities
│   ├── migrations/                 # 5 versioned SQL migration files
│   ├── requirements.txt
│   └── .env.example
│
└── docs/
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL database (local or Supabase)
- Firebase project (for auth)
- Gemini API key

### 1. Clone

```bash
git clone https://github.com/MrAbhishekA279784/DiscoveryOS.git
cd DiscoveryOS
```

### 2. Frontend Setup

```bash
npm install
```

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_API_BASE_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname
JWT_SECRET=your_super_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Database Migration

```bash
cd backend/migrations
python run_migrations.py
```

### 5. Run

```bash
# Terminal 1 — Frontend
npm run dev
# → http://localhost:3000

# Terminal 2 — Backend
cd backend
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs
```

---

## API Overview

The FastAPI backend auto-generates interactive docs at `/docs`. Key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | JWT token exchange |
| `POST` | `/uploads/` | File upload + parse trigger |
| `GET` | `/analytics/dashboard` | KPIs, pain points, sentiment |
| `POST` | `/copilot/chat` | Streaming AI response |
| `GET` | `/copilot/templates` | Prompt template library |
| `POST` | `/search/` | Full-text + semantic search |
| `GET` | `/projects/` | Workspace project list |
| `POST` | `/reports/compile` | Executive report generation |
| `GET` | `/datasources/` | Connected integration status |
| `GET` | `/health` | Service health check |

---

## Roadmap

- [x] Core feedback ingestion pipeline
- [x] AI Copilot with streaming responses
- [x] Pain point clustering and sentiment analysis
- [x] AI-generated product roadmap
- [x] Multi-tenant workspace support
- [x] PDF and PPTX export
- [ ] Real-time collaboration (multi-user)
- [ ] Slack bot integration
- [ ] Predictive churn analytics
- [ ] SOC 2 compliance + enterprise SSO
- [ ] Self-hosted Docker deployment

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then fork and submit a PR.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

---

## Author

**Abhishek Gupta**  
Mechanical & Mechatronics Engineering, Thakur College of Engineering & Technology

[GitHub @MrAbhishekA279784](https://github.com/MrAbhishekA279784)

---

## License

MIT © 2025 Abhishek Gupta
co author Shubham Bacche

---

<div align="center">

If DiscoveryOS saved you time, drop a ⭐ on GitHub — it helps others find it.

</div>
