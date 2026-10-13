import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { SensitiveAction, Language } from '../types';

interface HumanApprovalModalProps {
  action: SensitiveAction | null;
  isOpen: boolean;
  onClose: () => void;
  onDecide: (actionId: string, decision: 'approved' | 'rejected', signer: string, notes: string) => void;
  language: Language;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  action,
  isOpen,
  onClose,
  onDecide,
  language,
}) => {
  if (!isOpen || !action) return null;

  const isFa = language === 'fa';
  const [signerName, setSignerName] = useState('Executive Officer');
  const [auditNotes, setAuditNotes] = useState('');

  const handleApprove = () => {
    onDecide(action.id, 'approved', signerName || 'Executive Officer', auditNotes);
    onClose();
  };

  const handleReject = () => {
    onDecide(action.id, 'rejected', signerName || 'Executive Officer', auditNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden my-8"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-amber-400 font-semibold">{action.id}</span>
                <span className="text-slate-600">·</span>
                <span className="uppercase tracking-wider font-mono text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  {action.category}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white mt-1">{action.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto">
          {/* Governance Notice */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-200/90 leading-relaxed text-[11px]">
              {isFa
                ? 'هشدار حاکمیتی: این اقدام از مرز اختیارات مشورتی فراتر بوده و دربرگیرنده تعهدات مالی، حقوقی یا میدانی است. هوش مصنوعی مجاز به اجرای خودکار نبوده و امضای صریح انسانی الزامی است.'
                : 'Governance Notice: This action exceeds advisory scope and proposes material financial, legal, or field commitments. Automated execution is blocked; explicit human sign-off is mandatory.'}
            </p>
          </div>

          {/* Scope & Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">
                {isFa ? 'دامنه اقدام (Scope)' : 'Proposed Action Scope'}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{action.scope}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">
                {isFa ? 'اثر پیش‌بینی‌شده (Expected Impact)' : 'Expected Impact'}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{action.expectedImpact}</p>
            </div>
          </div>

          {/* Rollback Plan */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFa ? 'طرح بازگشت (Rollback Plan)' : 'Rollback & Contingency Plan'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{action.rollbackPlan}</p>
          </div>

          {/* Verification Checklist */}
          <div>
            <span className="text-slate-400 font-semibold block mb-2">
              {isFa ? 'چک‌لیست صحه‌گذاری پیش از اجرا' : 'Pre-Execution Verification Steps'}
            </span>
            <div className="space-y-1.5">
              {action.verificationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2 bg-slate-950/40 rounded border border-slate-800/80 text-[11px]"
                >
                  <div className="w-4 h-4 rounded-full border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-400 shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signer Authorization Form */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1">
                {isFa ? 'نام و سمت مقام امضاکننده:' : 'Authorizing Human Officer (Name & Title):'}
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                placeholder="e.g. Dr. M. Rezaei - Head of EPCM"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1">
                {isFa ? 'یادداشت ممیزی / شروط تصویب:' : 'Audit Trail Notes / Contingencies:'}
              </label>
              <textarea
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                placeholder={isFa ? 'تأیید مشروط به رعایت گزارش FTO...' : 'Approved subject to Stage-Gate 3 review...'}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isFa ? 'انصراف' : 'Cancel'}
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReject}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{isFa ? 'رد اقدام' : 'Reject Action'}</span>
            </button>
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isFa ? 'تصویب و ثبت امضا' : 'Sign & Authorize'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
