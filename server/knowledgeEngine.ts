/**
 * KKM Corporate Intelligence Agent v3.0
 * Local simulated response and governance checks.
 */

import { INITIAL_SENSITIVE_ACTIONS } from '../src/data/evidenceRepository';
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

  let sensitiveActionProposal: SensitiveAction | undefined;
  if (isSensitiveCapex) {
    sensitiveActionProposal = { ...INITIAL_SENSITIVE_ACTIONS[0], requestedAt: new Date().toISOString() };
  } else if (isSensitiveIP) {
    sensitiveActionProposal = { ...INITIAL_SENSITIVE_ACTIONS[1], requestedAt: new Date().toISOString() };
  } else if (isSensitiveFieldTest) {
    sensitiveActionProposal = { ...INITIAL_SENSITIVE_ACTIONS[2], requestedAt: new Date().toISOString() };
  }

  const epistemicBreakdown: EpistemicBreakdown = {
    facts: [],
    inferences: [],
    assumptions: [],
    estimates: [],
    recommendations: [],
    openIssues: [
      language === 'fa'
        ? `داده‌های نمونه ماژول ${moduleId} مستقل راستی‌آزمایی نشده‌اند و مبنای واقعیت سازمانی نیستند.`
        : `Module ${moduleId} sample data has not been independently verified and is not established company fact.`,
      language === 'fa'
        ? 'برای پاسخ مستند، اسناد اصلی و قابل بررسی لازم است.'
        : 'Primary, reviewable source documents are required for an evidence-based answer.',
    ],
  };

  const content = language === 'fa'
    ? `### پاسخ شبیه‌سازی‌شده\nداده‌های موجود در این نمونه را نمی‌توان به‌عنوان واقعیت تأییدشده شرکت تلقی کرد. برای پاسخ مستند، سند اصلی مرتبط باید بررسی شود. این پاسخ تحلیل واقعی یا توصیه تصمیم‌گیری ارائه نمی‌کند.${sensitiveActionProposal ? '\n\nاجرای اقدام حساس خودکار نیست و نیازمند بررسی و تأیید انسانی است.' : ''}`
    : `### Simulated response\nData in this prototype cannot be treated as verified company facts. A relevant primary source must be reviewed for an evidence-based answer. This response provides no substantive analysis or decision recommendation.${sensitiveActionProposal ? '\n\nSensitive actions are not automated and require human review and approval.' : ''}`;

  return {
    content,
    citations: [],
    epistemicBreakdown,
    sensitiveActionProposal,
  };
}
