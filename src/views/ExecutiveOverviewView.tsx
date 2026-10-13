import React from 'react';
import {
  Shield,
  FileCheck2,
  Layers,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MODULES, EVIDENCE_RECORDS } from '../data/evidenceRepository';
import { Language, ModuleId, SensitiveAction } from '../types';
import { ViewKey } from '../components/Sidebar';

interface ExecutiveOverviewViewProps {
  language: Language;
  onNavigate: (view: ViewKey) => void;
  onSelectModuleForChat: (moduleId: ModuleId) => void;
  pendingActions: SensitiveAction[];
  onOpenActionReview: (action: SensitiveAction) => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  language,
  onNavigate,
  onSelectModuleForChat,
  pendingActions,
  onOpenActionReview,
}) => {
  const isFa = language === 'fa';

  const stats = [
    {
      labelEn: 'Verified Knowledge Records',
      labelFa: 'اسناد صحه‌گذاری‌شده',
      val: EVIDENCE_RECORDS.length.toString(),
      subEn: '10 Corporate Modules',
      subFa: '۱۰ ماژول سازمانی',
      icon: <FileCheck2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      labelEn: 'Technology Pipeline',
      labelFa: 'طرح‌های فناوری فعال',
      val: '3 Initiatives',
      subEn: 'GMEL / Hubs / IIoT',
      subFa: 'GMEL / هاب‌ها / IIoT',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
    },
    {
      labelEn: 'Active Benchmarking',
      labelFa: 'سطح آمادگی فناوری',
      val: 'TRL 4 (Lab Bench)',
      subEn: 'Unvalidated for Field',
      subFa: 'تأییدنشده برای فیلد',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    },
    {
      labelEn: 'Pending Human Approvals',
      labelFa: 'تأییدیه‌های در انتظار امضا',
      val: `${pendingActions.filter((a) => a.status === 'pending').length} Action(s)`,
      subEn: 'Strict Governance Gate',
      subFa: 'دروازه حاکمیتی مسدود',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Executive Welcome & Mode Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>{isFa ? 'کنسول تصمیم‌گیری مدیران ارشد' : 'EXECUTIVE INTELLIGENCE BRIEFING'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {isFa
                ? 'سامانه هوش و تصمیم‌یار سازمانی KKM (نسخه ۳.۰)'
                : 'KKM Corporate Intelligence Agent v3.0'}
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {isFa
                ? 'پشتیبانی از تصمیم‌گیری‌های کلان گروه بین‌المللی KKM و کیمیا کران ماد. تمامی تحلیل‌ها مبتنی بر مخزن اسناد کنترل‌شده و تمایز دقیق میان شواهد تجربی و شبیه‌سازی‌ها ارائه می‌شوند.'
                : 'Decision support workspace for KKM International Group & Kimia Karan Mad. All assessments strictly ground in controlled company records with absolute distinction between empirical evidence and simulations.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-md transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFa ? 'آغاز پرسش و پاسخ هوشمند' : 'Launch Intelligence Query'}</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              {isFa ? 'ساخت گزارش ساختاریافته' : 'Generate Decision Report'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start justify-between"
          >
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">
                {isFa ? s.labelFa : s.labelEn}
              </span>
              <span className="text-lg font-bold font-mono tabular-nums text-white block">
                {s.val}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                {isFa ? s.subFa : s.subEn}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Strategic Alerts & Pending Governance Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Alerts Feed (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>{isFa ? 'هشدارهای راهبردی و مرزبندی‌های فناورانه' : 'Strategic Governance Briefings'}</span>
            </div>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
            >
              {isFa ? 'مشاهده همه اسناد' : 'View All Evidence'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-mono text-amber-400 font-semibold">KKM-RD-2025-008 · MOD-D</span>
                <span className="text-rose-400 font-medium">TRL 4 Lab Limit</span>
              </div>
              <h4 className="font-medium text-white mb-1">
                {isFa
                  ? 'طرح فناوری GMEL: ثبت بازده بنچ ۵۸.۴٪ و لزوم اجتناب از ادعای میدانی'
                  : 'GMEL Technology: 58.4% Lab Bench Recovery Recorded; Field Extrapolation Prohibited'}
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isFa
                  ? 'آزمون بنچ ۵ کیلووات حرارتی تکمیل گردید. ادعاهای فراتر از ۶۵٪ یا تعمیم به عملیات صنعتی پیوسته بر اساس استاندارد سازمانی اکیداً تأییدنشده بوده و ممنوع است.'
                  : 'Lab bench benchmarking confirms 58.4% ± 3.1% thermal efficiency. Field claims exceeding 65% are explicitly unvalidated and prohibited under corporate charter.'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-mono text-amber-400 font-semibold">KKM-IP-2024-002 · MOD-E</span>
                <span className="text-emerald-400 font-medium">FTO Boundary Clear</span>
              </div>
              <h4 className="font-medium text-white mb-1">
                {isFa
                  ? 'ارزیابی آزادی عمل تجاری (FTO) راکتور ترموشیمیایی و تفکیک از پتنت EP3429188B1'
                  : 'Thermochemical Reactor FTO: Nozzle Geometry Differentiation Cleared'}
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isFa
                  ? 'ادعاهای اختراع به‌گونه‌ای تنظیم گردیده که تداخل با کاتالیست‌های ثبت‌شده اروپایی به صفر برسد. اخذ تاییدیه وکلای رسمی پیش از انتشار نهایی الزامی است.'
                  : 'Claim boundaries maintain explicit differentiation from third-party multi-stage catalyst beds. Formal European counsel opinion remains a prerequisite for PCT publication.'}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Human Approval Queue (1 col) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Shield className="w-4 h-4 text-rose-400" />
                <span>{isFa ? 'صف تصمیمات حساس انسانی' : 'Human Approval Queue'}</span>
              </div>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                {pendingActions.filter((a) => a.status === 'pending').length} PENDING
              </span>
            </div>

            <div className="space-y-3">
              {pendingActions
                .filter((a) => a.status === 'pending')
                .slice(0, 2)
                .map((action) => (
                  <div
                    key={action.id}
                    className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs hover:border-amber-500/40 transition-colors cursor-pointer"
                    onClick={() => onOpenActionReview(action)}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-mono text-amber-300 font-semibold">{action.id}</span>
                      <span className="uppercase text-amber-400">{action.category}</span>
                    </div>
                    <p className="text-white font-medium line-clamp-2 text-[11px]">{action.title}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{isFa ? 'نیازمند امضای مدیر ارشد' : 'Awaiting Officer Sign-Off'}</span>
                      <span className="text-amber-400 font-medium">{isFa ? 'بررسی ←' : 'Review →'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4">
            <button
              onClick={() => onNavigate('governance')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded font-medium transition-colors text-center"
            >
              {isFa ? 'ورود به مرکز حاکمیت و تایید انسانی' : 'Open Governance Sign-Off Center'}
            </button>
          </div>
        </div>
      </div>

      {/* 10 Corporate Modules Matrix */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isFa ? 'ماژول‌های ده‌گانه هوش سازمانی KKM' : 'KKM Corporate Modules Directory'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isFa
                ? 'پوشش جامع حوزه‌های راهبردی، مهندسی، تحقیق و توسعه، مالکیت فکری و مالی'
                : 'Comprehensive coverage across strategy, engineering, IP, EPCM, and capital governance'}
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">10 ACTIVE DOMAINS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-mono text-amber-400 font-bold">{mod.code}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {mod.recordCount} {isFa ? 'سند' : 'docs'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                  {isFa ? mod.titleFa : mod.titleEn}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {isFa ? mod.descFa : mod.descEn}
                </p>
              </div>

              <button
                onClick={() => onSelectModuleForChat(mod.id)}
                className="mt-3 w-full py-1.5 px-2 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 rounded text-[11px] font-medium border border-slate-800 hover:border-amber-500/30 flex items-center justify-center gap-1 transition-colors"
              >
                <span>{isFa ? 'پرسش در ماژول' : 'Consult Module'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
