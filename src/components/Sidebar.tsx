import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  FileCheck2,
  FileText,
  Layers,
  ShieldAlert,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';

export type ViewKey =
  | 'overview'
  | 'chat'
  | 'evidence'
  | 'reports'
  | 'portfolio'
  | 'governance'
  | 'evaluation';

interface SidebarProps {
  currentView: ViewKey;
  onSelectView: (view: ViewKey) => void;
  language: Language;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  language,
  pendingApprovalsCount,
}) => {
  const isFa = language === 'fa';

  const navItems: { key: ViewKey; labelEn: string; labelFa: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: 'overview',
      labelEn: 'Executive Overview',
      labelFa: 'داشبورد مدیریتی',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: 'chat',
      labelEn: 'Intelligence Chat',
      labelFa: 'پرسش و پاسخ هوشمند',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      key: 'evidence',
      labelEn: 'Evidence Repository',
      labelFa: 'مخزن شواهد و اسناد',
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      key: 'reports',
      labelEn: 'Structured Reports',
      labelFa: 'تولید گزارش راهبردی',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: 'portfolio',
      labelEn: 'Technology Portfolio',
      labelFa: 'پورتفولیوی فناوری (TRL)',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      key: 'governance',
      labelEn: 'Human Approval Center',
      labelFa: 'مرکز تایید و حاکمیت',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: pendingApprovalsCount,
    },
    {
      key: 'evaluation',
      labelEn: 'Evaluation & Security',
      labelFa: 'آزمون‌ها و امنیت سیستم',
      icon: <Sliders className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            {isFa ? 'ناوبری سامانه' : 'Navigation'}
          </span>
          <span className="text-[11px] text-amber-400/80 font-mono">10 MODULES</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectView(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-amber-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{isFa ? item.labelFa : item.labelEn}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Corporate Metadata Footer */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-[11px] text-slate-500">
        <div className="flex items-center justify-between mb-1.5">
          <span>{isFa ? 'مرجع داده' : 'Ground Truth'}</span>
          <span className="text-slate-400 font-mono">KKM Vault</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{isFa ? 'وضعیت محرمانگی' : 'Security Mode'}</span>
          <span className="text-amber-400/90 font-mono">Level-2 Advisory</span>
        </div>
      </div>
    </aside>
  );
};
