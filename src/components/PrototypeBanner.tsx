import React from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { Language } from '../types';

interface PrototypeBannerProps {
  language: Language;
  onDismiss?: () => void;
}

export const PrototypeBanner: React.FC<PrototypeBannerProps> = ({ language, onDismiss }) => {
  const isFa = language === 'fa';

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">
              {isFa ? 'سامانه نمونه اولیه (Prototype Status):' : 'PROTOTYPE STATUS DISCLOSURE:'}
            </strong>{' '}
            {isFa
              ? 'این سامانه یک نمونه اولیه تحلیلی برای گروه بین‌المللی KKM و کیمیا کران ماد است. به سامانه‌های عملیاتی، ایمیل، بانکی یا DNS متصل نبوده و اقدامات حساس مستلزم تأیید صریح انسانی هستند.'
              : 'This is an internal decision-support prototype for KKM International Group & Kimia Karan Mad. Disconnected from production systems, live email, DNS, or banking. Sensitive actions require explicit human sign-off.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400/90 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isFa ? 'حالت محلی ایزوله' : 'Isolated Read-Only'}
          </span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-amber-400/70 hover:text-amber-200 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
