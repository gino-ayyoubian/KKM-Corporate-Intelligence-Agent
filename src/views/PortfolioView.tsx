import React from 'react';
import { Layers, AlertTriangle, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SAMPLE_PORTFOLIO_PROJECTS } from '../data/evidenceRepository';
import { Language, PortfolioProject } from '../types';

interface PortfolioViewProps {
  language: Language;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ language }) => {
  const isFa = language === 'fa';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>PORTFOLIO DIRECTORY</span>
          <span>·</span>
          <span>TECHNOLOGY READINESS LEVELS (TRL 1-9)</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {isFa
            ? 'پورتفولیوی پروژه‌ها و سطوح آمادگی فناوری (داده نمونه)'
            : 'Technology Pipeline & Readiness Portfolio (Sample Data)'}
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          {isFa
            ? 'نمایش وضعیت پروژه‌ها و نوآوری‌های گروه KKM و کیمیا کران ماد. تمامی اطلاعات این بخش صرفاً داده‌های نمونه اولیه بوده و نباید به عنوان صحه‌گذاری میدانی یا ظرفیت تجاری عملیاتی تلقی شوند.'
            : 'Read-only portfolio of KKM technology initiatives. Strictly designated as simulated sample data. Laboratory bench results (TRL 4) must never be conflated with commercial field validation.'}
        </p>

        {/* Global Prototype Watermark Notice */}
        <div className="mt-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isFa
              ? 'تذکر الزامی: طرح‌های GMEL و هاب‌های منطقه‌ای بر اساس سوابق مستند ارزیابی می‌شوند. هیچ‌یک از پروژه‌ها تا زمان تکمیل آزمون‌های میدانی رسمی به عنوان تاسیسات تجاری معرفی نمی‌گردند.'
              : 'Mandatory Disclosure: Initiatives such as GMEL and regional energy hubs are benchmarked against documented lab tests. Never represented as operational commercial assets.'}
          </span>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="space-y-6">
        {SAMPLE_PORTFOLIO_PROJECTS.map((project) => {
          return (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 relative overflow-hidden"
            >
              {/* Top Banner with Sample Data Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-xs">
                    {project.code}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {isFa ? project.nameFa : project.nameEn}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">
                      LEAD: {project.leadRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    [SAMPLE DATA - UNVALIDATED]
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* TRL Progress Bar Visualization (1 - 9) */}
              <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">
                      {isFa ? 'سطح آمادگی فناوری:' : 'Technology Readiness Level:'}
                    </span>
                    <span className="font-mono text-amber-300 font-bold text-sm">
                      TRL {project.trl} / 9
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {project.validationType}
                  </span>
                </div>

                {/* Visual Scale from 1 to 9 */}
                <div className="grid grid-cols-9 gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                    const isReached = lvl <= project.trl;
                    const isCurrent = lvl === project.trl;
                    return (
                      <div key={lvl} className="flex flex-col items-center gap-1">
                        <div
                          className={`h-2.5 w-full rounded-sm transition-all ${
                            isCurrent
                              ? 'bg-amber-400 ring-2 ring-amber-400/40'
                              : isReached
                              ? 'bg-amber-500/60'
                              : 'bg-slate-800'
                          }`}
                        />
                        <span
                          className={`text-[9px] font-mono ${
                            isCurrent
                              ? 'text-amber-300 font-bold'
                              : isReached
                              ? 'text-slate-400'
                              : 'text-slate-600'
                          }`}
                        >
                          L{lvl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Technical Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 p-4 bg-slate-950/50 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 font-semibold block mb-1.5">
                    {isFa ? 'شرح دامنه فنی و تجربی' : 'Technical Scope & Boundary Summary'}
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {isFa ? project.descriptionFa : project.descriptionEn}
                  </p>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800/80 space-y-2">
                  <div>
                    <span className="text-slate-400 text-[11px] block">
                      {isFa ? 'برآورد بودجه نمونه' : 'Sample Budget Metric'}
                    </span>
                    <span className="font-mono text-white text-sm font-semibold block mt-0.5">
                      {project.budgetSample}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 text-[11px] block">
                      {isFa ? 'وضعیت دسترسی' : 'Access Mode'}
                    </span>
                    <span className="text-emerald-400 font-mono text-xs block mt-0.5">
                      Read-Only Audit
                    </span>
                  </div>
                </div>
              </div>

              {/* Known Technical & Operational Risks */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  {isFa ? 'ریسک‌های فنی و محدودیت‌های ثبت‌شده' : 'Documented Technical & Operational Risks'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {project.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2 text-[11px] text-slate-300"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
