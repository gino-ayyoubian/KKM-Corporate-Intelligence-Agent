import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { SensitiveAction, Language } from '../types';

interface GovernanceCenterViewProps {
  language: Language;
  actions: SensitiveAction[];
  onOpenReviewModal: (action: SensitiveAction) => void;
}

export const GovernanceCenterView: React.FC<GovernanceCenterViewProps> = ({
  language,
  actions,
  onOpenReviewModal,
}) => {
  const isFa = language === 'fa';

  const pending = actions.filter((a) => a.status === 'pending');
  const decided = actions.filter((a) => a.status !== 'pending');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>SECURITY & HUMAN OVERSIGHT</span>
          <span>·</span>
          <span>OPERATING PRINCIPLE 8 & SECURITY RULE 5</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {isFa
            ? 'مرکز تایید و حاکمیت انسانی (Human Approval Center)'
            : 'Human Review & Governance Center'}
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          {isFa
            ? 'مدیریت و امضای اقدامات حساس. هوش مصنوعی مجاز به تخصیص مستقیم بودجه، ارسال درخواست ثبت اختراع یا اجرای آزمون‌های میدانی بدون تصویب مکتوب مقام انسانی نیست.'
            : 'Governance sign-off center for material proposals. The AI agent strictly operates in advisory mode; all capex commitments, patent filings, or field tests require explicit human authorization.'}
        </p>

        {/* Counter Stats */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isFa ? 'در انتظار امضا' : 'Pending Approvals'}
            </span>
            <span className="font-mono text-base font-bold text-rose-400">{pending.length}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isFa ? 'اقدامات مصوب' : 'Approved Actions'}
            </span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {actions.filter((a) => a.status === 'approved').length}
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isFa ? 'اقدامات رد شده' : 'Rejected Actions'}
            </span>
            <span className="font-mono text-base font-bold text-slate-400">
              {actions.filter((a) => a.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Actions List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{isFa ? 'پیشنهادهای نیازمند تصمیم‌گیری و امضا' : 'Action Proposals Awaiting Authorization'}</span>
        </h2>

        {pending.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
            {isFa
              ? 'در حال حاضر هیچ اقدام حساسی در انتظار امضا وجود ندارد.'
              : 'No pending actions in the approval queue.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pending.map((action) => (
              <div
                key={action.id}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-amber-400 font-bold text-xs">{action.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {action.category}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {action.requestedAt.split('T')[0]}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{action.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{action.scope}</p>

                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-1">
                    <div>
                      <strong className="text-slate-500">{isFa ? 'اثر:' : 'Impact:'} </strong>
                      {action.expectedImpact}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenReviewModal(action)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold shadow transition-colors"
                  >
                    {isFa ? 'بررسی شروط و امضا ←' : 'Review & Authorize →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Audit Trail Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{isFa ? 'دفتر ثبت رویدادهای ممیزی و امضاهای پیشین' : 'Governance Audit Trail Log'}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">IMMUTABLE SESSION LOG</span>
        </div>

        {decided.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            {isFa
              ? 'هنوز تصمیمی در این نشست ثبت نشده است.'
              : 'No historical approvals or rejections recorded in this session.'}
          </div>
        ) : (
          <div className="border border-slate-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3 font-mono">ID</th>
                  <th className="p-3">{isFa ? 'عنوان اقدام' : 'Action Item'}</th>
                  <th className="p-3">{isFa ? 'تصمیم' : 'Decision'}</th>
                  <th className="p-3">{isFa ? 'مقام امضاکننده' : 'Authorized Signer'}</th>
                  <th className="p-3 font-mono">{isFa ? 'زمان ثبت' : 'Timestamp'}</th>
                  <th className="p-3">{isFa ? 'یادداشت ممیزی' : 'Audit Notes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/30">
                {decided.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-mono text-amber-400">{item.id}</td>
                    <td className="p-3 font-medium text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          item.status === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.status === 'approved' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.decidedBy || 'Executive Officer'}</td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">
                      {item.decidedAt ? item.decidedAt.replace('T', ' ').slice(0, 19) : '-'}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] max-w-sm truncate">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
