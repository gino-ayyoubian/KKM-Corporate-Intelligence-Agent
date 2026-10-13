import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText, Calendar, UserCheck, Scale } from 'lucide-react';
import { EvidenceRecord, Language } from '../types';

interface EvidenceDrawerProps {
  record: EvidenceRecord | null;
  onClose: () => void;
  language: Language;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ record, onClose, language }) => {
  if (!record) return null;

  const isFa = language === 'fa';

  const statusBadgeColor =
    record.verificationStatus === 'Verified Record'
      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
      : record.verificationStatus === 'Engineering Estimate'
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
      : 'text-rose-400 bg-rose-950/40 border-rose-500/30';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-amber-300 font-semibold">{record.recordId}</span>
                <span className="text-slate-600">·</span>
                <span>{record.moduleId}</span>
              </div>
              <h2 className="text-sm font-semibold text-white mt-0.5">
                {isFa ? record.titleFa : record.titleEn}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-500 block">
                {isFa ? 'سطح محرمانگی' : 'Classification Level'}
              </span>
              <span className="font-mono text-slate-200 mt-0.5 block">{record.classification}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">
                {isFa ? 'تاریخ ثبت' : 'Effective Date'}
              </span>
              <span className="font-mono text-slate-200 mt-0.5 block">{record.date}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">
                {isFa ? 'وضعیت صحه‌گذاری' : 'Verification Status'}
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[11px] border mt-1 font-medium ${statusBadgeColor}`}
              >
                {record.verificationStatus}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">
                {isFa ? 'نمره اطمینان داده' : 'Confidence Score'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${record.confidenceScore}%` }}
                  />
                </div>
                <span className="font-mono text-amber-300 font-semibold">
                  {record.confidenceScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Epistemic Scope & Limitations Alert */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{isFa ? 'مرزبندی و محدودیت‌های دامنه' : 'Documented Scope & Testing Limits'}</span>
            </div>
            <p className="text-amber-200/90 leading-relaxed text-[11px]">
              {isFa ? record.scopeLimitationsFa : record.scopeLimitationsEn}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {isFa ? 'خلاصه محتوا' : 'Document Summary'}
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
              {isFa ? record.summaryFa : record.summaryEn}
            </p>
          </div>

          {/* Authoritative Excerpt */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {isFa ? 'متن بند استناد شده' : 'Authoritative Record Excerpt'}
            </h3>
            <blockquote className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-200/90 leading-relaxed">
              "{isFa ? record.fullExcerptFa : record.fullExcerptEn}"
            </blockquote>
          </div>

          {/* Documented Metrics (if present) */}
          {record.metrics && record.metrics.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {isFa ? 'شاخص‌های کمی ثبت شده' : 'Recorded Quantitative Metrics'}
              </h3>
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden">
                {record.metrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/40">
                    <span className="text-slate-400">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-200 font-medium">{m.value}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          m.verified
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : 'bg-amber-950/60 text-amber-400'
                        }`}
                      >
                        {m.verified ? 'Verified' : 'Estimate'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification & Audit Role */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{isFa ? 'مرجع صدور:' : 'Authorizing Entity:'}</span>
            </div>
            <span className="text-slate-300 font-medium">{record.authorRole}</span>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Audit Hash: SHA256-OK</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors"
          >
            {isFa ? 'بستن پنل' : 'Close Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};
