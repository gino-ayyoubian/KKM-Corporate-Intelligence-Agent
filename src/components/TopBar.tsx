import React from 'react';
import { Globe, Cpu, Database, ShieldAlert, Sparkles } from 'lucide-react';
import { Language, EngineMode } from '../types';

interface TopBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  engineMode: EngineMode;
  onEngineModeChange: (mode: EngineMode) => void;
  activeViewTitle: string;
  pendingApprovalsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onLanguageChange,
  engineMode,
  onEngineModeChange,
  activeViewTitle,
  pendingApprovalsCount,
}) => {
  const isFa = language === 'fa';

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-6">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm">
            KKM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap">
              {isFa ? 'سامانه هوش سازمانی KKM' : 'KKM Corporate Intelligence'}
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono tracking-wider">
              AGENT v3.0 · PROTOTYPE
            </span>
          </div>
        </div>

        {/* Zone 2: Context Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 truncate">
          <span className="text-slate-500">{isFa ? 'گروه بین‌المللی KKM' : 'KKM International Group'}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">{isFa ? 'کیمیا کران ماد' : 'Kimia Karan Mad'}</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-300 font-medium truncate">{activeViewTitle}</span>
        </div>

        {/* Zone 3: Interactive Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Engine Mode Segmented Control */}
          <div className="flex items-center bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
            <button
              onClick={() => onEngineModeChange('gemini')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                engineMode === 'gemini'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Server-side Gemini Live API with automatic fallback"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Gemini API</span>
            </button>
            <button
              onClick={() => onEngineModeChange('simulated')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                engineMode === 'simulated'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Local Corporate Knowledge Engine (Deterministic)"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{isFa ? 'موتور محلی' : 'Local Engine'}</span>
            </button>
          </div>

          {/* Bilingual Language Selector */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'fa' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
            title="Toggle Language (English / فارسی)"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{language === 'en' ? 'فارسی' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
