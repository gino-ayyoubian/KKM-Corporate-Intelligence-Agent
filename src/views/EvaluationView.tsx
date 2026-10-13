import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  ShieldCheck,
  FileCode,
  ListChecks,
  Lock,
} from 'lucide-react';
import { EVALUATION_TEST_CASES } from '../data/evidenceRepository';
import { EvaluationCase, Language } from '../types';
import { runSystemEvaluation, EvaluationResult } from '../../server/api/evaluateHandler';

interface EvaluationViewProps {
  language: Language;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ language }) => {
  const isFa = language === 'fa';
  const [isRunning, setIsRunning] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult>(() =>
    runSystemEvaluation()
  );

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runSystemEvaluation();
      setEvaluationResult(res);
      setIsRunning(false);
    }, 600);
  };

  const threatModelItems = [
    {
      titleEn: 'Threat 1: LLM Hallucination of Technical/Patent Claims',
      titleFa: 'تهدید ۱: جعل ادعاهای فنی یا وضعیت ثبت اختراع توسط مدل زبانی',
      mitigationEn: 'Controlled Knowledge Grounding: Agent explicitly cites record IDs with documented confidence and boundary limitations. Extrapolation beyond TRL 4 is prohibited by system instructions.',
      mitigationFa: 'استناد انحصاری به مخزن مدارک کنترل‌شده: درج اجباری شناسه سند، نمره اطمینان و مرزبندی TRL 4 مانع از تعمیم شبیه‌سازی به ادعای میدانی می‌شود.',
    },
    {
      titleEn: 'Threat 2: Unauthorized Production Execution & Credential Leakage',
      titleFa: 'تهدید ۲: اجرای غیرمجاز بر سامانه‌های عملیاتی و افشای کلیدهای دسترسی',
      mitigationEn: 'Server Proxy Isolation: Gemini SDK is executed strictly server-side. Zero API keys exposed to browser bundles. Automated execution against banking, DNS, or SCADA is architecturally blocked.',
      mitigationFa: 'ایزولاسیون پروکسی سرور: ارتباط با Gemini صرفاً سمت سرور Node.js انجام شده و هیچ کلید یا رمزی به مرورگر ارسال نمی‌گردد. اجرای دستورات روی سامانه‌های عملیاتی غیرممکن است.',
    },
    {
      titleEn: 'Threat 3: Prompt Injection Overriding Governance Principles',
      titleFa: 'تهدید ۳: تزریق پرامپت جهت دور زدن اصول حاکمیتی و دروازه تایید',
      mitigationEn: 'Data vs Authority Separation: User inputs are treated strictly as data, never as authority to bypass human sign-off gates or invent corporate authorization.',
      mitigationFa: 'تفکیک داده از مرجعیت حاکمیتی: ورودی‌های کاربر صرفاً به عنوان داده پردازش شده و قادر به دور زدن الزام تأیید انسانی نیستند.',
    },
  ];

  const productionChecklist = [
    {
      titleEn: 'Persistent Relational Database & Role-Based Access Control (RBAC)',
      titleFa: 'پایگاه داده رابطه‌ای پایدار و کنترل دسترسی مبتنی بر نقش (RBAC)',
      statusEn: 'Roadmap (Deferred for Prototype)',
      statusFa: 'نقشه راه آتی (موکول به فاز پس از آزمون)',
      done: false,
    },
    {
      titleEn: 'Enterprise Single Sign-On (SSO / SAML / OIDC)',
      titleFa: 'ورود یکپارچه سازمانی (SSO / OIDC)',
      statusEn: 'Roadmap (Disconnected)',
      statusFa: 'نقشه راه آتی (بدون اتصال در نمونه اولیه)',
      done: false,
    },
    {
      titleEn: 'Live Enterprise Document Retrieval (RAG with Access Filters)',
      titleFa: 'بازیابی زنده اسناد سازمانی (RAG فیلترشده با سطح دسترسی)',
      statusEn: 'Roadmap (Controlled JSON Used)',
      statusFa: 'نقشه راه آتی (مخزن JSON کنترل‌شده فعال است)',
      done: false,
    },
    {
      titleEn: 'Decoupled API Handler Architecture for Serverless / Cloud Run',
      titleFa: 'معماری ماژولار هندلرهای API برای استقرار سرورلس و Cloud Run',
      statusEn: 'Verified & Implemented',
      statusFa: 'پیاده‌سازی و صحه‌گذاری شده',
      done: true,
    },
    {
      titleEn: 'Epistemic Taxonomy Separation (Facts vs Assumptions vs Advice)',
      titleFa: 'تفکیک ساختاریافته معرفتی (شواهد، مفروضات، برآوردها و پیشنهادها)',
      statusEn: 'Verified & Implemented',
      statusFa: 'پیاده‌سازی و صحه‌گذاری شده',
      done: true,
    },
    {
      titleEn: 'Human-in-the-Loop Approval Gate for Sensitive Financial/IP Actions',
      titleFa: 'دروازه نظارت انسانی برای تصمیمات حساس مالی، حقوقی و میدانی',
      statusEn: 'Verified & Implemented',
      statusFa: 'پیاده‌سازی و صحه‌گذاری شده',
      done: true,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>SYSTEM VERIFICATION HARNESS</span>
              <span>·</span>
              <span>SAFETY & AUDIT SUITE</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isFa
                ? 'ارزیابی سیستم، مدل تهدید و چک‌لیست آمادگی تولید'
                : 'System Evaluation, Threat Model & Production Readiness'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              {isFa
                ? 'اجرای آزمون‌های خودکار صحه‌گذاری مرزهای معرفتی، مدل‌سازی تهدیدات امنیتی، فهرست محدودیت‌های شناخته‌شده و الزامات استقرار عملیاتی.'
                : 'Automated test suite verifying epistemic boundaries, credential isolation, threat mitigations, and the production readiness roadmap.'}
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors disabled:opacity-50 self-start shrink-0"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? (isFa ? 'در حال آزمون...' : 'Evaluating...') : isFa ? 'اجرای مجدد آزمون‌ها' : 'Run Test Suite'}</span>
          </button>
        </div>

        {/* Test Summary Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isFa ? 'کل سناریوها' : 'Total Cases'}</span>
            <span className="text-white font-bold text-base mt-0.5 block">{evaluationResult.totalTests}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-emerald-400 block text-[11px]">{isFa ? 'موفق' : 'Passed'}</span>
            <span className="text-emerald-300 font-bold text-base mt-0.5 block">{evaluationResult.passedTests}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-amber-400 block text-[11px]">{isFa ? 'هشدار' : 'Warnings'}</span>
            <span className="text-amber-300 font-bold text-base mt-0.5 block">{evaluationResult.warningTests}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-rose-400 block text-[11px]">{isFa ? 'ناموفق' : 'Failed'}</span>
            <span className="text-rose-300 font-bold text-base mt-0.5 block">{evaluationResult.failedTests}</span>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span>{isFa ? 'نتایج سناریوهای آزمون خودکار' : 'Automated Verification Test Cases'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluationResult.cases.map((tc) => (
            <div
              key={tc.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-400 font-semibold">{tc.id}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    tc.result === 'passed'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tc.result === 'passed' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {tc.result}
                </span>
              </div>

              <h3 className="font-bold text-white text-xs">{tc.title}</h3>

              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1.5 text-[11px]">
                <p className="text-slate-400">
                  <strong className="text-slate-300">{isFa ? 'پرامپت آزمون: ' : 'Test Prompt: '}</strong>
                  "{tc.prompt}"
                </p>
                <p className="text-slate-400">
                  <strong className="text-slate-300">{isFa ? 'انتظار رفتاری: ' : 'Expected Behavior: '}</strong>
                  {tc.expectedBehavior}
                </p>
              </div>

              <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded text-[11px] text-emerald-300">
                <strong>{isFa ? 'نتیجه بازرسی: ' : 'Verification Check: '}</strong>
                {tc.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Model Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>{isFa ? 'مدل تهدیدات امنیتی و راهکارهای مهار' : 'Documented Threat Model & Mitigations'}</span>
        </h2>

        <div className="space-y-3">
          {threatModelItems.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1.5 text-xs">
              <h3 className="font-semibold text-amber-300">
                {isFa ? item.titleFa : item.titleEn}
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isFa ? item.mitigationFa : item.mitigationEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Production Readiness Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-emerald-400" />
          <span>{isFa ? 'چک‌لیست آمادگی برای استقرار تولید (Production Readiness Checklist)' : 'Production Readiness Roadmap & Checklist'}</span>
        </h2>

        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden">
          {productionChecklist.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/40 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded border border-slate-600 shrink-0" />
                )}
                <span className={`font-medium ${item.done ? 'text-white' : 'text-slate-400'}`}>
                  {isFa ? item.titleFa : item.titleEn}
                </span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded shrink-0 ${
                  item.done
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isFa ? item.statusFa : item.statusEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
