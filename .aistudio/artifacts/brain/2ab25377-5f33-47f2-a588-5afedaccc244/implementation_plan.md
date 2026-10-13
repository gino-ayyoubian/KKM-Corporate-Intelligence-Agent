# KKM Corporate Intelligence Agent v3.0 (نسخه ۳.۰ سامانه هوش و تصمیم‌یار سازمانی)

An executive decision-support prototype workspace for **KKM International Group** and **Kimia Karan Mad (کیمیا کران ماد)**, delivering traceable corporate intelligence, evidence-backed strategic decision-making, bilingual Persian/English workflows, and strict human review governance.

---

## User Review & Critical Decisions (تصمیمات کلیدی معماری و بازخورد کاربر)

> [!IMPORTANT]
> The implementation plan incorporates all technical refinements and scope guardrails provided by executive feedback:

1. **Centralized Model Configuration (تنظیم متمرکز مدل Gemini)**:
   - Model name defined strictly once in a single server-side configuration file (`server/config.ts`), defaulting to `process.env.GEMINI_MODEL || 'gemini-flash-latest'`.
   - Never duplicated across multiple source files. Includes automatic fallback if API quota or key is not available.

2. **Decoupled API Architecture (تفکیک معماری API سرور)**:
   - API endpoints (`/api/agent/chat`, `/api/agent/report`, `/api/agent/evaluate`, `/api/agent/evidence`) implemented as pure Express request handlers in a dedicated `server/api/` module.
   - Mounted via Vite development middleware in dev (`vite.config.ts`), but structured cleanly so the exact same handler functions run in standalone Express or serverless deployments without refactoring.

3. **Strict Epistemic Taxonomy (دسته‌بندی دقیق معرفتی)**:
   - System outputs strictly separate and label:
     - **Verified Facts (شواهد تأیید شده)**: Citing record ID, date, classification, and source.
     - **Inferences & Analysis (تحلیل و استنباط)**: Logical deductions grounded in known facts.
     - **Assumptions (مفروضات)**: Explicit boundary conditions and missing parameters.
     - **Estimates (برآوردها)**: Projections with labeled confidence bounds.
     - **Recommendations (پیشنهادها)**: Strategic advisory options.
     - **Open Issues & Approvals (مسائل باز و تاییدیه انسانی)**: Action items requiring human sign-off.

4. **Structured Phased Delivery (دامنه کنترل‌شده نسخه اول)**:
   - **Phase 01: Executive Core (هسته اجرایی)**: Dashboard, 10-module navigation, bilingual Persian/English (RTL/LTR), dual-mode engine (Gemini server proxy vs. local corporate engine), prominent Prototype disclaimer.
   - **Phase 02: Evidence & Reporting (شواهد و گزارش)**: Versioned JSON evidence repository, citation inspector drawer, structured decision reports, risk matrix, Markdown & JSON export.
   - **Phase 03: Governance & Evaluation (حاکمیت و ارزیابی)**: Human Approval Center for sensitive actions, audit event log, test suite with boundary evaluation, threat model and production readiness checklist.
   - **Phase 04: Future Roadmap (آماده‌سازی آتی - برون‌سپاری شده)**: Database persistence, enterprise SSO, live document retrieval (RAG) from production systems, multi-tier RBAC explicitly documented as roadmap items and not wired to production.

---

## 1. Overview & Core Concept (مفهوم بنیادین و هدف)

### What It Does
KKM Corporate Intelligence Agent v3.0 serves as an internal intelligence console for KKM International Group executives, project managers, and lead engineers. Rather than relying on unstructured LLM memory, the system uses a **controlled corporate knowledge repository** as its primary ground truth. It evaluates initiatives such as GMEL clean technology, energy hubs, industrial digitalization, and EPCM infrastructure projects, strictly separating verified field results from conceptual simulations.

### Target Audience & Persona
- **Executive Leadership & Board Members**: Strategy evaluation, capex governance, risk tradeoffs.
- **Chief Engineers & R&D Leads**: Technology Readiness Level (TRL) audits, engineering constraints, experimental boundaries.
- **Legal & IP Counsel**: Patent status, trade secret protection, freedom-to-operate checks.

---

## 2. User Experience & Visual Design (طراحی بصری و تجربه کاربری)

### Visual System: Executive Dark Slate & Gold
- **Dominant Neutral Canvas (60%)**: Dark Slate `#090E17` / `#0F172A`.
- **Structural Surfaces (30%)**: Deep Navy `#162032` / Slate 800 with 1px hairline borders (`rgba(51,65,85,0.6)`).
- **Accent Budget (10%)**: Muted Executive Warm Gold `#D4AF37` / `#E2B144` for primary CTAs and active states.
- **Anti-Slop Discipline**: No decorative pulsing dots, no fake telemetry tickers, no pill badges for static metadata (unboxed text separated by `·` or `/`), single elevation depth.
- **Bilingual & RTL/LTR**: Seamless toggling between Persian (فارسی, `dir="rtl"`, Persian typography `Vazirmatn` / system Persian) and English (`dir="ltr"`, `Plus Jakarta Sans`). Numerical values and timestamps use tabular monospace (`font-mono tabular-nums`).

### Key Views
1. **Executive Overview Dashboard**: Strategic status across all 10 corporate modules, prototype boundary warnings, active corporate alerts, and pending approval queue.
2. **Bilingual Intelligence Chat**: Interactive consultation with module selector, sample executive queries, evidence citation markers, and live model/simulated mode selector.
3. **Evidence Inspector Drawer**: In-depth inspection of cited documents (Record ID, title, date, classification level, confidence bounds, scope limitations, verified status).
4. **Structured Decision Report Generator**: Interactive report builder generating standard corporate reports (Executive Conclusion, Evidence, Alternatives, Risk Matrix, Recommended Plan with Owners and Acceptance Criteria) with instant Markdown and JSON export.
5. **Human Approval & Governance Center**: Review and sign-off queue for sensitive actions (Capex allocation, IP disclosure, field testing), complete with action scope, impact analysis, rollback procedures, and simulated audit logs.
6. **Sample Portfolio Explorer**: Read-only showcase of KKM technology initiatives (e.g. GMEL clean energy pipeline, rural energy hubs), explicitly badged as `[SAMPLE DATA - UNVALIDATED]`.
7. **System Evaluation & Security Matrix**: Evaluation test harness, threat model documentation, known prototype limitations, and production readiness checklist.

---

## 3. Technical Architecture & Data Strategy (معماری فنی و جریان داده)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE DIAGRAM                            │
└────────────────────────────────────────────────────────────────────────────────┘

  Browser Client (React 19 + TypeScript + Tailwind CSS v4)
  ┌────────────────────────────────────────────────────────────────────────────┐
  │ TopBar: Language Toggle (EN/FA) · Mode (Gemini / Simulated) · Prototype Tag│
  ├───────────────────┬────────────────────────────────────────────────────────┤
  │ Sidebar Navigation│ Active View Router                                     │
  │ • Executive Home  │ ┌────────────────────────────────────────────────────┐ │
  │ • Agent Chat      │ │ 01. Executive Overview & Strategic Alerts          │ │
  │ • 10 Modules      │ ├────────────────────────────────────────────────────┤ │
  │ • Evidence Store  │ │ 02. Multilingual Chat + Citation Inspector Drawer  │ │
  │ • Report Builder  │ ├────────────────────────────────────────────────────┤ │
  │ • Portfolio (TRL) │ │ 03. Structured Decision Report (Markdown / JSON)   │ │
  │ • Human Approval  │ ├────────────────────────────────────────────────────┤ │
  │ • System Eval     │ │ 04. Human Approval Center & Governance Audit Log   │ │
  │                   │ ├────────────────────────────────────────────────────┤ │
  │                   │ │ 05. Technology Readiness Portfolio (Sample Data)   │ │
  │                   │ ├────────────────────────────────────────────────────┤ │
  │                   │ │ 06. Evaluation Suite, Threat Model & Checklist     │ │
  │                   │ └────────────────────────────────────────────────────┘ │
  └───────────────────┴────────────────────────────────────────────────────────┘
                                      │  Fetch JSON (/api/agent/*)
                                      ▼
  Decoupled Node.js Server Layer (Express Handlers / Vite Middleware)
  ┌────────────────────────────────────────────────────────────────────────────┐
  │ server/config.ts                                                           │
  │   └── GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-flash-latest'      │
  │   └── GEMINI_API_KEY: process.env.GEMINI_API_KEY                           │
  ├────────────────────────────────────────────────────────────────────────────┤
  │ server/api/                                                                │
  │   ├── chatHandler.ts      -> calls @google/genai or local knowledge engine │
  │   ├── reportHandler.ts    -> generates structured Markdown / JSON reports  │
  │   ├── evaluateHandler.ts  -> runs test validation harness                  │
  │   └── evidenceStore.ts    -> versioned corporate knowledge records         │
  └────────────────────────────────────────────────────────────────────────────┘
```

### Controlled Knowledge Repository (Data Schema)
Each record in `src/data/evidenceRepository.json` adheres to strict corporate governance schema:
- `recordId`: e.g., `KKM-ENG-2025-014`, `KKM-IP-2024-002`
- `module`: One of the 10 corporate modules (A through J)
- `titleEn` / `titleFa`: Bilingual record titles
- `date`: Document effective date (ISO YYYY-MM-DD)
- `classification`: `Confidential`, `Restricted`, `Public-Sample`
- `status`: `Verified Record`, `Engineering Estimate`, `Simulation Concept (Unvalidated)`
- `confidence`: Confidence score (0-100%)
- `scopeLimitations`: Explicit domain boundaries and testing conditions
- `summaryEn` / `summaryFa`: Summary text
- `metrics`: Quantitative parameters with units and verification status

---

## 4. Phase-by-Phase Implementation Roadmap (برنامه گام‌به‌گام پیاده‌سازی)

### Phase 1: Executive Core (هسته اجرایی)
- Project metadata and document headers updated to KKM Corporate Intelligence Agent v3.0.
- Centralized server configuration (`server/config.ts`) and API routes.
- Decoupled server handlers for `/api/agent/chat` and `/api/agent/report` with dual-mode support (Gemini API server proxy + Local Corporate Knowledge fallback).
- Responsive Shell with Executive Dark Slate & Gold theme, single-line TopBar, RTL/LTR dynamic direction flipping, and prominent Prototype Banner.
- Executive Overview dashboard with module overview cards and active corporate briefings.

### Phase 2: Evidence & Reporting (شواهد و گزارش)
- Controlled sample knowledge base across all 10 corporate modules with authentic metadata (GMEL, energy hubs, IP, financial models).
- Interactive bilingual AI chat with module selector, prompt suggestions, and evidence tag embedding.
- Slide-over Evidence Drawer for reviewing cited source documents.
- Structured Decision Report Generator with live preview, risk matrix, owner-assigned action items, and Markdown/JSON export.

### Phase 3: Governance, Human Approval & Evaluation (حاکمیت و ارزیابی)
- Human Review Workflow Mockup: modal and dedicated view for sensitive proposals (action, scope, impact, rollback, verification).
- Audit trail log recording simulated approvals, rejections, and policy evaluations.
- Evaluation Console displaying automated test cases, epistemic boundary verification, threat model documentation, and production readiness checklist.

### Phase 4: Production Readiness & Boundary Documentation (مستندسازی و مرزبندی)
- Technical README with setup instructions and environment variables.
- Documented threat model, security constraints, and production readiness checklist.
- Clean compilation verification (`compile_applet`) and zero-error verification.
