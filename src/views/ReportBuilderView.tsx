import React, { useState } from 'react';
import {
  Download,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { MODULES } from '../data/evidenceRepository';
import { ModuleId, Language, DecisionReport } from '../types';
import { generateReport } from '../api/client';

interface ReportBuilderViewProps {
  language: Language;
  apiToken: string;
  onInspectRecord: (recordId: string) => void;
}

export const ReportBuilderView: React.FC<ReportBuilderViewProps> = ({
  language,
  apiToken,
  onInspectRecord,
}) => {
  const isFa = language === 'fa';
  const [selectedModule, setSelectedModule] = useState<ModuleId>('D');
  const [reportTitle, setReportTitle] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [activeReport, setActiveReport] = useState<DecisionReport | null>(null);
  const [activeMarkdown, setActiveMarkdown] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportError(false);
    try {
      const result = await generateReport({
        title: reportTitle.trim(),
        moduleId: selectedModule,
        language,
        customContext,
      }, apiToken);
      setActiveReport(result.report);
      setActiveMarkdown(result.markdown);
    } catch {
      setReportError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!activeReport) return;
    const blob = new Blob([activeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeReport.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!activeReport) return;
    const jsonStr = JSON.stringify(activeReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeReport.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    if (!activeReport) return;
    navigator.clipboard.writeText(activeMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>EXECUTIVE GOVERNANCE</span>
          <span>·</span>
          <span>STRUCTURED DECISION ARTIFACTS</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {isFa
            ? 'تولید گزارش ساختاریافته تصمیم‌یار سازمانی'
            : 'Structured Executive Decision Report Generator'}
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          {isFa
            ? 'تولید اسناد رسمی تصمیم‌گیری با ساختار استاندارد ۷ بخشی: نتیجه‌گیری، شواهد، گزینه‌های راهبردی، ماتریس ریسک، پیشنهاد نهایی، برنامه اقدام با مسئول و معیارهای پذیرش، و مسائل باز.'
            : 'Generates standardized 7-section executive decision briefs: conclusion, evidence, alternatives, risk matrix, recommendation, action plan with owners & acceptance criteria, and open issues.'}
        </p>

        {/* Configuration Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {isFa ? 'ماژول راهبردی مربوطه:' : 'Target Corporate Module:'}
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value as ModuleId)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-500"
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {isFa ? m.titleFa : m.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {isFa ? 'عنوان گزارش (اختیاری):' : 'Custom Report Title (Optional):'}
            </label>
            <input
              type="text"
              maxLength={200}
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder={
                isFa
                  ? 'مثال: ارزیابی پیشرفت فاز ۱ پروژه GMEL'
                  : 'e.g., GMEL Phase 1 Pilot Stage-Gate Evaluation'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? (isFa ? 'در حال تولید...' : 'Generating...') : isFa ? 'تولید گزارش ساختاریافته' : 'Generate Decision Brief'}</span>
            </button>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {isFa ? 'زمینه تکمیلی (به‌عنوان ورودی تأییدنشده درج می‌شود):' : 'Additional context (included as unverified user input):'}
            </label>
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              maxLength={4000}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        {reportError && (
          <p role="alert" className="mt-3 text-xs text-rose-300">
            {isFa ? 'گزارش از API در دسترس تولید نشد. وضعیت سرویس را بررسی کنید.' : 'The report API is unavailable. Check the service status.'}
          </p>
        )}
      </div>

      {/* Generated Report Preview Area */}
      {activeReport ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Action Bar */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-bold text-xs">{activeReport.id}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{activeReport.createdAt.split('T')[0]}</span>
              <span className="text-slate-600">·</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {activeReport.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? (isFa ? 'کپی شد' : 'Copied') : isFa ? 'کپی Markdown' : 'Copy MD'}</span>
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-6 md:p-8 space-y-6 text-xs text-slate-300">
            {/* Title Header */}
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {activeReport.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>MODULE: {activeReport.moduleId}</span>
                <span>·</span>
                <span>KKM INTERNATIONAL GROUP & KIMIA KARAN MAD</span>
              </div>
            </div>

            {/* 1. Executive Conclusion */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>1. {isFa ? 'نتیجه‌گیری مدیریتی' : 'Executive Conclusion'}</span>
              </h3>
              <p className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-200 leading-relaxed text-xs md:text-sm">
                {activeReport.executiveConclusion}
              </p>
            </div>

            {/* 2. Verified Evidence */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                2. {isFa ? 'رکوردهای نمونه ارجاع‌شده (تأییدنشده)' : 'Referenced Sample Records (Unverified)'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeReport.referencedEvidence.map((recId) => (
                  <button
                    key={recId}
                    onClick={() => onInspectRecord(recId)}
                    className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors text-left flex items-center justify-between gap-4 font-mono text-xs"
                  >
                    <span>[{recId}]</span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      {isFa ? 'رکورد نمونه؛ تأییدنشده' : 'Illustrative; unverified'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Strategic Alternatives */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                3. {isFa ? 'تحلیل گزینه‌های راهبردی' : 'Strategic Alternatives Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeReport.strategicAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-xs">{alt.option}</h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                            alt.riskLevel === 'low'
                              ? 'bg-emerald-950/60 text-emerald-400'
                              : 'bg-rose-950/60 text-rose-400'
                          }`}
                        >
                          {alt.riskLevel} Risk
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-slate-300">
                          <strong className="text-emerald-400 font-medium">
                            {isFa ? 'مزایا: ' : 'Pros: '}
                          </strong>
                          {alt.pros}
                        </p>
                        <p className="text-slate-400">
                          <strong className="text-rose-400 font-medium">
                            {isFa ? 'معایب: ' : 'Cons: '}
                          </strong>
                          {alt.cons}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Risk Matrix */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                4. {isFa ? 'ماتریس ریسک و اقدامات کنترلی' : 'Risk Matrix & Mitigation Controls'}
              </h3>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3">{isFa ? 'دسته ریسک' : 'Category'}</th>
                      <th className="p-3">{isFa ? 'شرح ریسک' : 'Description'}</th>
                      <th className="p-3">{isFa ? 'راهکار کنترل و کاهش' : 'Mitigation Strategy'}</th>
                      <th className="p-3 text-right">{isFa ? 'ریسک باقیمانده' : 'Residual'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/30">
                    {activeReport.riskMatrix.map((r, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-white">{r.category}</td>
                        <td className="p-3 text-slate-300">{r.description}</td>
                        <td className="p-3 text-slate-400">{r.mitigation}</td>
                        <td className="p-3 text-right font-mono uppercase text-amber-400 text-[11px]">
                          {r.residualRisk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Recommendation */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                5. {isFa ? 'پیشنهاد راهبردی مصوب' : 'Recommended Strategic Path'}
              </h3>
              <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed text-xs md:text-sm">
                {activeReport.recommendation}
              </div>
            </div>

            {/* 6. Action Plan */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                6. {isFa ? 'برنامه اقدام با مسئول، وابستگی و معیار پذیرش' : 'Executable Action Plan'}
              </h3>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3 font-mono">#</th>
                      <th className="p-3">{isFa ? 'شرح اقدام' : 'Action Item'}</th>
                      <th className="p-3">{isFa ? 'مسئول پیگیری' : 'Owner'}</th>
                      <th className="p-3">{isFa ? 'وابستگی‌ها' : 'Dependencies'}</th>
                      <th className="p-3">{isFa ? 'معیار پذیرش' : 'Acceptance Criteria'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/30">
                    {activeReport.actionPlan.map((act) => (
                      <tr key={act.id}>
                        <td className="p-3 font-mono text-amber-400">{act.id}</td>
                        <td className="p-3 font-medium text-white">{act.action}</td>
                        <td className="p-3 text-slate-300">{act.owner}</td>
                        <td className="p-3 text-slate-400">{act.dependencies}</td>
                        <td className="p-3 font-mono text-emerald-300 text-[11px]">
                          {act.acceptanceCriteria}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Open Issues */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
                7. {isFa ? 'مسائل باز و تاییدیه‌های موردنیاز' : 'Open Issues & Approval Prerequisites'}
              </h3>
              <ul className="space-y-1.5 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-300 list-disc list-inside">
                {activeReport.openIssues.map((issue, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
          {isFa
            ? 'برای تولید گزارش، ماژول و عنوان را در بالا انتخاب کرده و روی دکمه "تولید گزارش ساختاریافته" کلیک فرمایید.'
            : 'Select target corporate module and click "Generate Decision Brief" to produce a traceable decision document.'}
        </div>
      )}
    </div>
  );
};
