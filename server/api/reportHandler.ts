/**
 * KKM Corporate Intelligence Agent v3.0
 * Structured Report Generation & Export Handler
 */

import { DecisionReport, ModuleId, Language } from '../../src/types';
import { EVIDENCE_RECORDS, MODULES } from '../../src/data/evidenceRepository';

export interface ReportRequestPayload {
  title?: string;
  moduleId: ModuleId;
  language: Language;
  customContext?: string;
}

export function generateStructuredReport(payload: ReportRequestPayload): DecisionReport {
  const { title, moduleId, language } = payload;
  const customContext = payload.customContext?.trim();
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const referencedEvidence = EVIDENCE_RECORDS
    .filter((record) => record.moduleId === moduleId)
    .map((record) => record.recordId);
  const isPersian = language === 'fa';
  const contextLabel = isPersian ? 'زمینه ارائه‌شده توسط کاربر (راستی‌آزمایی‌نشده)' : 'User-provided context (unverified)';
  const executiveConclusion = isPersian
    ? `این پیش‌نویس برای ماژول ${mod.code} تهیه شده است. داده‌های نمونه و زمینه کاربر، سند تأییدشده محسوب نمی‌شوند؛ پیش از هر تصمیم، منابع اصلی باید بررسی شوند.`
    : `This is a draft for module ${mod.code}. Sample records and user-provided context are not verified evidence; inspect primary sources before making a decision.`;
  const recommendation = isPersian
    ? 'هیچ توصیه یا ادعای کمی بر اساس داده‌های تأییدنشده ارائه نمی‌شود. بررسی مستقل اسناد و تأیید انسانی پیش‌شرط استفاده تصمیم‌گیری است.'
    : 'No recommendation or quantitative claim is made from unverified data. Independently review source documents and obtain human approval before using this report for decisions.';

  return {
    id: `KKM-REP-${Date.now().toString().slice(-6)}`,
    title: title?.trim() || (isPersian ? `پیش‌نویس گزارش: ${mod.titleFa}` : `Draft Report: ${mod.titleEn}`),
    moduleId,
    language,
    createdAt: new Date().toISOString(),
    status: 'Draft',
    executiveConclusion: customContext
      ? `${executiveConclusion}\n\n${contextLabel}:\n${customContext}`
      : executiveConclusion,
    referencedEvidence,
    strategicAlternatives: [],
    riskMatrix: [],
    recommendation,
    actionPlan: [],
    openIssues: [
      isPersian
        ? 'تطبیق همه رکوردهای نمونه با اسناد اصلی و تأیید وضعیت آن‌ها.'
        : 'Match every sample record to its primary source and verify its status.',
      isPersian
        ? 'بررسی مستقل زمینه ارائه‌شده توسط کاربر.'
        : 'Independently review the user-provided context.',
    ],
    requiresHumanApproval: true,
    approvalStatus: 'Pending',
  };
}

export function reportToMarkdown(report: DecisionReport): string {
  const isFa = report.language === 'fa';
  return `# ${report.title}
**Report ID:** ${report.id}  
**Date:** ${report.createdAt.split('T')[0]}  
**Module:** ${report.moduleId}  
**Status:** ${report.status}  
**Human Approval:** Required

---

## 1. ${isFa ? 'نتیجه‌گیری مدیریتی' : 'Executive Conclusion'}
${report.executiveConclusion}

## 2. ${isFa ? 'رکوردهای نمونه ارجاع‌شده (تأییدنشده)' : 'Referenced sample records (unverified)'}
${report.referencedEvidence.length
    ? report.referencedEvidence.map((id) => `- Illustrative; not independently verified: \`${id}\``).join('\n')
    : isFa ? 'رکوردی برای این ماژول وجود ندارد.' : 'No records are available for this module.'}

## 3. ${isFa ? 'گزینه‌های راهبردی' : 'Strategic Alternatives'}
${isFa ? 'برای جلوگیری از ساخت ادعا، گزینه‌ای تولید نشده است.' : 'No alternatives generated to avoid inventing claims.'}

## 4. ${isFa ? 'ماتریس ریسک' : 'Risk Matrix'}
${isFa ? 'بدون ارزیابی مستند، ریسک‌ها تعیین نشده‌اند.' : 'Risks are not assessed without verified source material.'}

## 5. ${isFa ? 'پیشنهاد' : 'Recommendation'}
${report.recommendation}

## 6. ${isFa ? 'برنامه اقدام' : 'Action Plan'}
${isFa ? 'برنامه اقدامی تولید نشده است.' : 'No action plan generated.'}

## 7. ${isFa ? 'مسائل باز' : 'Open Issues'}
${report.openIssues.map((issue) => `- ${issue}`).join('\n')}

---
*Prototype output. Sample data and user-provided context are unverified and must not be treated as company facts.*
`;
}
