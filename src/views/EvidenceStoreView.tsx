import React, { useState } from 'react';
import { Search, Filter, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { EVIDENCE_RECORDS, MODULES } from '../data/evidenceRepository';
import { EvidenceRecord, Language, ModuleId } from '../types';

interface EvidenceStoreViewProps {
  language: Language;
  onInspectRecord: (record: EvidenceRecord) => void;
}

export const EvidenceStoreView: React.FC<EvidenceStoreViewProps> = ({
  language,
  onInspectRecord,
}) => {
  const isFa = language === 'fa';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredRecords = EVIDENCE_RECORDS.filter((rec) => {
    const matchesModule = selectedModule === 'ALL' || rec.moduleId === selectedModule;
    const matchesStatus = selectedStatus === 'ALL' || rec.verificationStatus === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      rec.recordId.toLowerCase().includes(q) ||
      rec.titleEn.toLowerCase().includes(q) ||
      rec.titleFa.toLowerCase().includes(q) ||
      rec.summaryEn.toLowerCase().includes(q) ||
      rec.summaryFa.toLowerCase().includes(q);

    return matchesModule && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>KKM ARCHIVE VAULT</span>
              <span>·</span>
              <span>CONTROLLED EVIDENCE</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isFa
                ? 'مخزن اسناد و شواهد کنترل‌شده سازمانی'
                : 'Controlled Corporate Evidence Repository'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {isFa
                ? 'مرجع حقیقت و استناد سامانه هوش سازمانی. تمامی تحلیل‌های مشورتی صرفاً بر پایه اسناد نسخهبندیشده این مخزن صادر می‌شوند.'
                : 'Ground truth records for executive decision support. All AI assertions cite verifiable record IDs, dates, and strict epistemic scope boundaries.'}
            </p>
          </div>
          <div className="px-3.5 py-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 self-start">
            {EVIDENCE_RECORDS.length} {isFa ? 'سند ثبت‌شده' : 'Verified Documents'}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFa ? 'جستجو در شناسه، عنوان یا متن سند...' : 'Search record ID, title, or keywords...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">{isFa ? 'تمامی ماژول‌ها (A-J)' : 'All Modules (A-J)'}</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {isFa ? m.titleFa : m.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">{isFa ? 'تمامی وضعیت‌های صحه‌گذاری' : 'All Verification Statuses'}</option>
              <option value="Verified Record">{isFa ? 'سند تأیید شده (Verified)' : 'Verified Record'}</option>
              <option value="Engineering Estimate">{isFa ? 'برآورد مهندسی (Estimate)' : 'Engineering Estimate'}</option>
              <option value="Simulation Concept (Unvalidated)">
                {isFa ? 'شبیه‌سازی / مفهوم (تأییدنشده)' : 'Simulation Concept (Unvalidated)'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((rec) => {
          const isVerified = rec.verificationStatus === 'Verified Record';
          const isEstimate = rec.verificationStatus === 'Engineering Estimate';

          return (
            <div
              key={rec.recordId}
              onClick={() => onInspectRecord(rec)}
              className="p-4 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">{rec.recordId}</span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-slate-400 text-[11px]">{rec.moduleId}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      isVerified
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                        : isEstimate
                        ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                        : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {rec.verificationStatus}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {isFa ? rec.titleFa : rec.titleEn}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {isFa ? rec.summaryFa : rec.summaryEn}
                </p>

                <div className="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-amber-200/90 font-mono line-clamp-2">
                  "{isFa ? rec.fullExcerptFa : rec.fullExcerptEn}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="font-mono">{rec.date}</span>
                  <span>·</span>
                  <span className="font-mono text-amber-400 font-medium">
                    {rec.confidenceScore}% Confidence
                  </span>
                </div>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                  {isFa ? 'بررسی سند ←' : 'Inspect Record →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
          {isFa
            ? 'هیچ سندی با معیارهای فیلتر جستجو یافت نشد.'
            : 'No records matched the selected query or filter criteria.'}
        </div>
      )}
    </div>
  );
};
