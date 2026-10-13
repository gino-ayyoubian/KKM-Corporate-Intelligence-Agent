# KKM Corporate Intelligence Agent v3.0

An internal executive decision-support prototype workspace for **KKM International Group** and **Kimia Karan Mad (کیمیا کران ماد)**.

---

## 1. Executive Mission & Operating Principles

The KKM Corporate Intelligence Agent supports executive decision-making, corporate strategy, engineering, R&D, intellectual property management, digital transformation, project development (EPCM), risk management, and commercialization.

### Core Operating Principles
1. **Authoritative Within Scope Only**: Treat verified company records as authoritative only within their documented scope and date.
2. **Epistemic Distinction**: Strictly separate verified facts, user-provided inputs, assumptions, estimates, recommendations, and unresolved questions.
3. **No Hallucinated Data**: Never invent company data, legal status, patent status, financial figures, project performance, technical validation, or completed actions.
4. **Mandatory Citations**: Always cite source documents, record identifiers (e.g. `KKM-ENG-2025-014`), dates, and confidence bounds.
5. **Bilingual Parity**: Native Persian (فارسی) for Persian requests and English for English requests with natural technical terminology preservation and full RTL support.
6. **Human Approval for Sensitive Operations**: Capital allocation, international patent filings, unattended field tests, and production system modifications are blocked from automated execution and require human sign-off.
7. **Technology Readiness (TRL) Boundaries**: Initiatives such as GMEL are evaluated against documented empirical evidence (TRL 4 lab bench scale; 58.4% efficiency). Never represent simulations or bench tests as commercial field validation.

---

## 2. System Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Server Layer**: Node.js with decoupled request handlers (`server/api/`) compatible with both Vite development middleware and standalone Express / Serverless containers.
- **AI Integration**:
  - **Live Mode**: Server-side `@google/genai` calling `gemini-flash-latest` using `process.env.GEMINI_API_KEY`. API keys are strictly server-side and never exposed to browser bundles.
  - **Local Vault Engine (Simulated Mode)**: Deterministic corporate knowledge engine providing epistemic breakdowns, risk matrices, and action plans.
- **Controlled Knowledge Store**: Versioned JSON repository (`src/data/evidenceRepository.ts`) containing ground truth records across 10 corporate modules.

---

## 3. The 10 Corporate Modules

| Module | Code | Title (EN) | Title (FA) |
| :--- | :--- | :--- | :--- |
| **A** | MOD-A | Executive Intelligence & Decision Support | هوش اجرایی و پشتیبانی تصمیم‌گیری |
| **B** | MOD-B | Corporate Strategy, Governance & Performance | راهبرد سازمانی، حاکمیت و عملکرد |
| **C** | MOD-C | Engineering, Energy & Infrastructure | مهندسی، انرژی و زیرساخت |
| **D** | MOD-D | Research, Development & Technology Readiness | تحقیق، توسعه و آمادگی فناوری (TRL) |
| **E** | MOD-E | Intellectual Property, Patents & Trade Secrets | مالکیت فکری، ثبت اختراع و اسرار تجاری |
| **F** | MOD-F | Project Management, EPCM & Risk | مدیریت پروژه، EPCM و مدیریت ریسک |
| **G** | MOD-G | Digital Platforms, Software & Cybersecurity | پلتفرم‌های دیجیتال و امنیت سایبری |
| **H** | MOD-H | Finance, Funding & Commercialization | مالی، تامین سرمایه و تجاری‌سازی |
| **I** | MOD-I | Sustainability, Rural Development & Energy Hubs | پایداری، توسعه روستایی و هاب‌های انرژی |
| **J** | MOD-J | Knowledge Management & Corporate Reporting | مدیریت دانش و گزارش‌دهی سازمانی |

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Quickstart
```bash
# 1. Clone repository and navigate to workspace
cd /app/applet

# 2. Configure environment (optional Gemini API Key for live AI responses)
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application runs on `http://localhost:3000`.

---

## 5. Threat Model & Known Prototype Limitations

### Threat Model
1. **LLM Hallucination Risk**: Addressed through strict grounding against controlled record IDs and disabling speculative extrapolation beyond documented TRL levels.
2. **Credential Disclosure**: Addressed by isolating Gemini API calls exclusively within the server-side proxy. No keys or tokens are delivered to the frontend.
3. **Unauthorized Production Actions**: Addressed by architectural air-gapping. The prototype possesses zero external write adapters to banking, production DNS, live email, or SCADA systems. Sensitive action proposals enter an isolated human review queue.

### Known Limitations
- Operates on a controlled in-memory sample dataset; does not connect to live internal SharePoint, Documentum, or ERP systems.
- User authentication and session persistence are simulated for prototype evaluation.
- PDF generation is recommended via browser Print-to-PDF or external serverless renderer in production.

---

## 6. Production Readiness Checklist

- [x] Server-side API key isolation and decoupled request handlers.
- [x] Standardized 7-section structured decision reports with Markdown & JSON export.
- [x] Epistemic taxonomy separation (facts, inferences, assumptions, estimates, recommendations).
- [x] Human approval gate mockup with rollback procedures and audit trail.
- [ ] Production PostgreSQL / Cloud SQL database with row-level encryption.
- [ ] Enterprise SSO (Okta / SAML / OIDC) integration.
- [ ] Live enterprise document ingestion pipeline (RAG with role-based access filtering).
- [ ] Centralized SIEM audit log forwarding.
