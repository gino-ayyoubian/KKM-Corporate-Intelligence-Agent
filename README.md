# KKM Corporate Intelligence Agent v3.0

An internal executive decision-support prototype workspace for **KKM International Group** and **Kimia Karan Mad (کیمیا کران ماد)**.

---

## 1. Executive Mission & Operating Principles

The KKM Corporate Intelligence Agent supports executive decision-making, corporate strategy, engineering, R&D, intellectual property management, digital transformation, project development (EPCM), risk management, and commercialization.

### Core Operating Principles
1. **Unverified Prototype Data**: Records in this repository are illustrative samples and are not verified company documents.
2. **Epistemic Distinction**: Do not present sample records or user-provided inputs as verified facts.
3. **No Hallucinated Data**: Never invent company data, legal status, patent status, financial figures, project performance, technical validation, or completed actions.
4. **No Unsupported Citations**: The prototype does not validate claim-level citations; sample record IDs are not proof.
5. **Bilingual Parity**: Native Persian (فارسی) for Persian requests and English for English requests with natural technical terminology preservation and full RTL support.
6. **Human Approval for Sensitive Operations**: Capital allocation, international patent filings, unattended field tests, and production system modifications are blocked from automated execution and require human sign-off.
7. **Technology Readiness Boundaries**: No technical, financial, legal, or operational figure in the sample data has been independently verified.

---

## 2. System Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Server Layer**: Node.js with decoupled request handlers (`server/api/`) compatible with both Vite development middleware and standalone Express / Serverless containers.
- **AI Integration**:
  - **Live Mode**: Server-side `@google/genai` calling `gemini-flash-latest` using `process.env.GEMINI_API_KEY`. API keys are strictly server-side and never exposed to browser bundles.
  - **Local Vault Engine (Simulated Mode)**: Deterministic prototype response that does not treat sample data as fact.
- **Sample Data Store**: In-memory illustrative records (`src/data/evidenceRepository.ts`) across 10 prototype modules.

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

# 3. Install locked dependencies
npm ci

# 4. Start local development server
npm run dev
```

The application runs on `http://localhost:3000`.

For deployments outside development, set `KKM_API_TOKEN` using a secret manager. The browser requests this shared bearer token at the API access screen; it is held in memory only. Do not use this prototype token as a substitute for enterprise SSO or user-level authorization.

---

## 5. Threat Model & Known Prototype Limitations

### Threat Model
1. **LLM Hallucination Risk**: Sample records are not supplied as verified evidence; model responses may still be inaccurate and require independent review.
2. **Credential Disclosure**: Gemini API calls execute server-side. Do not expose API credentials through frontend configuration.
3. **API Access**: The API requires a shared bearer token outside development and applies an in-memory per-IP request limit. This is not enterprise SSO, per-user authorization, or a distributed rate limit; do not expose it publicly without an authenticated gateway and role-based access controls.

### Known Limitations
- Operates on a controlled in-memory sample dataset; does not connect to live internal SharePoint, Documentum, or ERP systems.
- The API token is shared across users; enterprise identity, fine-grained authorization, and session persistence are not implemented.
- The repository's visibility and Git history have not been assessed by this code change. Restrict repository access and review its full history for exposed secrets or sensitive data before further use.
- Sample data may contain content requiring ownership and classification review despite its illustrative label.
- PDF generation is recommended via browser Print-to-PDF or external serverless renderer in production.

---

## 6. Production Readiness Checklist

- [x] Server-side API key isolation for Gemini requests.
- [x] Shared bearer-token check, per-process IP rate limiting, bounded request bodies, and payload validation.
- [ ] Enterprise SSO, per-user authorization, and gateway-level distributed rate limiting.
- [x] Draft report generation avoids unsupported claims and labels sample references as unverified.
- [ ] Claim-level citation validation and independent review of source records.
- [x] Simulated responses do not claim sample records as facts.
- [ ] Human approval gate backed by authenticated identities and a durable audit trail.
- [ ] Production PostgreSQL / Cloud SQL database with row-level encryption.
- [ ] Enterprise SSO (Okta / SAML / OIDC) integration.
- [ ] Live enterprise document ingestion pipeline (RAG with role-based access filtering).
- [ ] Centralized SIEM audit log forwarding.
