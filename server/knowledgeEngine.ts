/**
 * KKM Corporate Intelligence Agent v3.0
 * Local Corporate Knowledge Engine & Analytical Reasoner
 *
 * Provides authoritative ground truth and simulated reasoning grounded
 * strictly in KKM International Group and Kimia Karan Mad controlled records.
 */

import { EVIDENCE_RECORDS, MODULES, INITIAL_SENSITIVE_ACTIONS } from '../src/data/evidenceRepository';
import { ModuleId, Language, EpistemicBreakdown, SensitiveAction } from '../src/types';

export interface KnowledgeEngineResponse {
  content: string;
  citations: string[];
  epistemicBreakdown: EpistemicBreakdown;
  sensitiveActionProposal?: SensitiveAction;
}

export function generateCorporateIntelligenceResponse(
  prompt: string,
  moduleId: ModuleId,
  language: Language
): KnowledgeEngineResponse {
  const normalizedPrompt = prompt.toLowerCase();
  const selectedModule = MODULES.find((m) => m.id === moduleId) || MODULES[0];

  // Retrieve relevant records for module and topic
  const moduleRecords = EVIDENCE_RECORDS.filter(
    (r) => r.moduleId === moduleId || normalizedPrompt.includes(r.recordId.toLowerCase())
  );
  const relevantRecord = moduleRecords.length > 0 ? moduleRecords[0] : EVIDENCE_RECORDS[0];
  const citations = [relevantRecord.recordId];

  // Detect sensitive actions requiring human approval
  const isSensitiveCapex =
    normalizedPrompt.includes('capex') ||
    normalizedPrompt.includes('allocate') ||
    normalizedPrompt.includes('خرید') ||
    normalizedPrompt.includes('تخصیص') ||
    normalizedPrompt.includes('$') ||
    normalizedPrompt.includes('میلیون');

  const isSensitiveIP =
    normalizedPrompt.includes('patent') ||
    normalizedPrompt.includes('pct') ||
    normalizedPrompt.includes('ثبت اختراع') ||
    normalizedPrompt.includes('افشا') ||
    normalizedPrompt.includes('file');

  const isSensitiveFieldTest =
    normalizedPrompt.includes('test') ||
    normalizedPrompt.includes('آزمون میدانی') ||
    normalizedPrompt.includes('تست') ||
    normalizedPrompt.includes('commission') ||
    normalizedPrompt.includes('unattended');

  let sensitiveActionProposal: SensitiveAction | undefined = undefined;

  if (isSensitiveCapex) {
    sensitiveActionProposal = {
      ...INITIAL_SENSITIVE_ACTIONS[0],
      requestedAt: new Date().toISOString(),
    };
  } else if (isSensitiveIP) {
    sensitiveActionProposal = {
      ...INITIAL_SENSITIVE_ACTIONS[1],
      requestedAt: new Date().toISOString(),
    };
  } else if (isSensitiveFieldTest) {
    sensitiveActionProposal = {
      ...INITIAL_SENSITIVE_ACTIONS[2],
      requestedAt: new Date().toISOString(),
    };
  }

  // Construct structured epistemic breakdown
  const epistemicBreakdown: EpistemicBreakdown = {
    facts: [
      language === 'fa'
        ? `سند معتبر سازمانی: ${relevantRecord.recordId} (${relevantRecord.titleFa}) مورخ ${relevantRecord.date} با وضعیت "${relevantRecord.verificationStatus}".`
        : `Verified record: ${relevantRecord.recordId} (${relevantRecord.titleEn}) dated ${relevantRecord.date} with status "${relevantRecord.verificationStatus}".`,
      language === 'fa'
        ? `حریم و محدودیت دامنه: ${relevantRecord.scopeLimitationsFa}`
        : `Scope limitation: ${relevantRecord.scopeLimitationsEn}`,
    ],
    inferences: [
      language === 'fa'
        ? `تحلیل استنباطی: بر اساس اطلاعات موجود، توسعه پروژه در چارچوب حاکمیتی KKM نیازمند صحه‌گذاری دو مرحله‌ای است.`
        : `Deduction: Project advancement within KKM governance strictly requires two-stage technical and audit validation gates.`,
    ],
    assumptions: [
      language === 'fa'
        ? `مفروضات: فرض بر ثبات پارامترهای خوراک و صدور به موقع تاییدیه‌های رگولاتوری برق و محیط‌زیست است.`
        : `Assumptions: Stable feedstock parameters and timely environmental/utility interconnection permits are assumed.`,
    ],
    estimates: [
      language === 'fa'
        ? `برآوردها: نمره اطمینان مستندات پایه برابر ${relevantRecord.confidenceScore}٪ ارزیابی شده است.`
        : `Estimates: Baseline documentation confidence score is estimated at ${relevantRecord.confidenceScore}%.`,
    ],
    recommendations: [
      language === 'fa'
        ? `پیشنهاد: اولویت‌بندی آزمون‌های پایلوت کنترل‌شده پیش از هرگونه تعهد سرمایه‌ای بلندمدت.`
        : `Recommendation: Prioritize controlled pilot testing before committing long-term capex allocations.`,
    ],
    openIssues: [
      language === 'fa'
        ? `مسائل باز: نیاز به تاییدیه رسمی کمیته حسابرسی و عدم تعمیم نتایج آزمایشگاهی به فیلد صنعتی.`
        : `Open issues: Formal audit committee concurrence required; laboratory results must not be conflated with industrial field operations.`,
    ],
  };

  // Structured response content
  let content = '';

  if (language === 'fa') {
    content = `### ۱. نتیجه‌گیری مدیریتی (Executive Conclusion)
بر اساس سوابق مدون سازمانی و مصوبات کمیته راهبری KKM و کیمیا کران ماد، تصمیم‌گیری پیرامون موضوع مطروحه مستلزم تفکیک شفاف میان شواهد صحه‌گذاری‌شده آزمایشگاهی و فرضیات شبیه‌سازی است. هرگونه تعهد اجرایی منوط به رعایت دروازه‌های مرحله‌ای (Stage-Gate) می‌باشد.

### ۲. شواهد و سوابق مستند (Verified Evidence & Sources)
- **شناسه سند:** \`${relevantRecord.recordId}\` | **سطح محرمانگی:** ${relevantRecord.classification}
- **وضعیت اعتبارسنجی:** ${relevantRecord.verificationStatus}
- **تاریخ استناد:** ${relevantRecord.date} | **نمره اطمینان:** ${relevantRecord.confidenceScore}٪
- **متن استناد:** "${relevantRecord.fullExcerptFa}"
- **محدودیت دامنه:** ${relevantRecord.scopeLimitationsFa}

### ۳. تحلیل گزینه‌ها (Analysis & Alternatives)
- **گزینه الف (توسعه محتاطانه بر پایه شواهد):** استمرار ارزیابی در مقیاس پایلوت کنترل‌شده تا زمان تثبیت شاخص‌های پایداری و کاهش ریسک.
- **گزینه ب (شتاب‌بخشی تجاری):** انتقال مستقیم به مرحله تجاری‌سازی که به دلیل عدم وجود آزمون میدانی طولانی‌مدت، ریسک انحراف بازده و افت کاتالیست را در پی دارد.

### ۴. ریسک‌ها و محدودیت‌ها (Risks & Limitations)
- **ریسک اعتبارسنجی:** نتایج مدل‌سازی و بنچ آزمایشگاهی نباید معادل عملکرد میدانی تلقی شود.
- **ریسک مالکیت فکری:** ضرورت بررسی پیوسته عدم تداخل با پتنت‌های ثبت‌شده شخص ثالث.
- **ریسک مالی:** انحراف هزینه‌های اولیه (Capex) و وابستگی به تعرفه‌های خرید تضمینی.

### ۵. پیشنهاد راهبردی (Strategic Recommendation)
اجرای گزینه الف با تمرکز بر تکمیل آزمون‌های ۱۲۰ ساعته پیوسته، اخذ تاییدیه وکلای رسمی مالکیت فکری، و عدم ثبت سفارش تجهیزات با دوره ساخت طولانی پیش از تصویب دروازه فنی.

### ۶. برنامه اقدام با مسئول و معیارهای پذیرش (Action Plan)
| ردیف | شرح اقدام | مسئول | وابستگی | معیار پذیرش |
| :--- | :--- | :--- | :--- | :--- |
| ۰۱ | صحه‌گذاری آزمون آزمایشگاهی ۱۲۰ ساعته | مدیریت R&D کیمیا کران ماد | تامین خوراک پایدار | بازده اندازه‌گیری‌شده $\\ge 58.4\\%$ |
| ۰۲ | ممیزی ادعاهای ثبت اختراع و FTO | مدیریت امور حقوقی و IP | گزارش رسمی وکیل بین‌المللی | تفکیک قطعی از پتنت EP3429188B1 |
| ۰۳ | ارسال پیشنهاد تخصیص منابع به هیئت مدیره | مدیر ارشد مالی KKM | تکمیل گزارش دروازه ۳ | تاییدیه اتفاق‌آرای کمیته سرمایه‌گذاری |

### ۷. مسائل باز و نیازمندی‌های تأیید (Open Issues & Approvals)
${
  sensitiveActionProposal
    ? `⚠️ **توجه نظارتی:** این اقدام از دسته تصمیمات حساس سازمانی (${sensitiveActionProposal.category.toUpperCase()}) تشخیص داده شد. اجرای این عملیات مسدود است و نیازمند تاییدیه صریح انسانی در «مرکز تایید و حاکمیت» می‌باشد.`
    : `کلیه اقدامات اجرایی تا پیش از جلسه ماهانه کمیته راهبردی در وضعیت مشورتی قرار دارند.`
}`;
  } else {
    content = `### 1. Executive Conclusion
Pursuant to verified corporate records and KKM International Group / Kimia Karan Mad governance charters, this decision requires strict demarcation between bench-scale verified empirical evidence and theoretical simulations. Operational commitment remains strictly gated.

### 2. Verified Evidence & Documented Sources
- **Record Identifier:** \`${relevantRecord.recordId}\` | **Classification:** ${relevantRecord.classification}
- **Verification Status:** ${relevantRecord.verificationStatus}
- **Document Date:** ${relevantRecord.date} | **Confidence Score:** ${relevantRecord.confidenceScore}%
- **Authoritative Citation:** "${relevantRecord.fullExcerptEn}"
- **Documented Boundary:** ${relevantRecord.scopeLimitationsEn}

### 3. Analysis of Feasible Alternatives
- **Option A (Evidence-Gated Progression):** Maintain controlled bench/pilot testing until endurance kinetics and degradation thresholds are empirically validated.
- **Option B (Accelerated Commercialization):** Immediate procurement and field commissioning; introduces unacceptable capex exposure and thermal cycle failure risk.

### 4. Material Risks & Known Limitations
- **Epistemic Limitation:** Bench-scale observations (5 kWth) must not be represented as commercial continuous operations.
- **Intellectual Property Risk:** Prior art proximity requires rigorous boundary claims before publication or filing.
- **Capital & Cost Risk:** Feedstock volatility and long-lead switchgear lead times (24 weeks).

### 5. Strategic Recommendation
Adopt Option A. Prioritize completion of the 120-hour continuous bench cycle, obtain formal European FTO clearance, and enforce dual-sponsor sign-off before executing major procurement lines.

### 6. Executable Action Plan
| # | Action Item | Assigned Owner | Dependencies | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| 01 | Complete 120h continuous test run | Kimia Karan Mad R&D Lead | Stable feedstock delivery | Measured efficiency $\\ge 58.4\\%$ |
| 02 | Finalize patent claim carve-outs | KKM Senior IP Counsel | European search report | Unambiguous carve-out from EP3429188B1 |
| 03 | Present capital allocation request | KKM Chief Financial Officer | Stage-Gate 3 technical sign-off | Unanimous Executive Committee vote |

### 7. Open Issues & Governance Approvals
${
  sensitiveActionProposal
    ? `⚠️ **Governance Notice:** This action involves sensitive corporate operations (${sensitiveActionProposal.category.toUpperCase()}). Automated execution is blocked. Explicit human approval via the Governance Center is mandatory.`
    : `All strategic directions remain in advisory prototype status pending formal monthly executive review.`
}`;
  }

  return {
    content,
    citations,
    epistemicBreakdown,
    sensitiveActionProposal,
  };
}
