import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Database,
  FileCheck2,
  ShieldAlert,
  Download,
  Trash2,
  HelpCircle,
  ChevronDown,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { MODULES, EVIDENCE_RECORDS } from '../data/evidenceRepository';
import {
  ChatMessage,
  Language,
  EngineMode,
  ModuleId,
  SensitiveAction,
  EvidenceRecord,
} from '../types';

interface ChatViewProps {
  language: Language;
  engineMode: EngineMode;
  activeModuleId: ModuleId;
  onModuleChange: (moduleId: ModuleId) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, moduleId: ModuleId) => Promise<void>;
  isLoading: boolean;
  hasError: boolean;
  onInspectRecord: (recordId: string) => void;
  onOpenActionReview: (action: SensitiveAction) => void;
  onClearChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  language,
  engineMode,
  activeModuleId,
  onModuleChange,
  messages,
  onSendMessage,
  isLoading,
  hasError,
  onInspectRecord,
  onOpenActionReview,
  onClearChat,
}) => {
  const isFa = language === 'fa';
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeModule = MODULES.find((m) => m.id === activeModuleId) || MODULES[0];

  const samplePromptsEn: Record<ModuleId, string[]> = {
    A: [
      'Evaluate KKM Group capex priority rules for capital investments exceeding $1.5M.',
      'What are the board-approved criteria for industrial cluster development?',
    ],
    B: [
      'Summarize the Kimia Karan Mad Joint Operating Agreement governance rules.',
      'What is the delegation of authority for engineering project deliverables?',
    ],
    C: [
      'Detail the 20kV / 63kV microgrid interconnection and heat recovery calculations.',
      'What are the ambient temperature constraints on the industrial ORC cycle?',
    ],
    D: [
      'What is the validated field thermal efficiency of the GMEL clean energy reactor?',
      'Detail the GMEL TRL 4 bench testing boundaries and catalyst degradation kinetics.',
    ],
    E: [
      'What is the patent boundary for the GMEL reactor against EP3429188B1 prior art?',
      'Are there any pending trade secret disclosures in the nozzle turbulence claims?',
    ],
    F: [
      'Identify the critical path and long-lead items for the Rural Energy Hub EPC schedule.',
      'What are the stage-gate criteria for Foundation Pour Milestone MS-03?',
    ],
    G: [
      'What is the cybersecurity policy for connecting IIoT telemetry to corporate consoles?',
      'Are cloud agents permitted to trigger remote firmware updates on plant SCADA?',
    ],
    H: [
      'Allocate $2.4M capex immediately to purchase the GMEL Hastelloy reactor.',
      'What is the base case IRR sensitivity against a 20% capex overrun?',
    ],
    I: [
      'What are the ESG decarbonization baseline metrics for rural agro-industrial hubs?',
      'Detail the CO2 reduction potential and local employment multiplier.',
    ],
    J: [
      'What standard governs AI epistemic boundaries and document verification classifications?',
      'Explain Standard J-02 on prohibiting unvalidated field claims.',
    ],
  };

  const samplePromptsFa: Record<ModuleId, string[]> = {
    A: [
      'قواعد اولویت‌بندی سرمایه‌گذاری‌های فراتر از ۱.۵ میلیون دلار در KKM را ارزیابی کنید.',
      'معیارهای مصوب هیئت مدیره برای توسعه خوشه‌های صنعتی چیست؟',
    ],
    B: [
      'اصول حاکمیتی توافقنامه عملیاتی مشترک کیمیا کران ماد را تشریح نمایید.',
      'تفویض اختیارات در تحویل خروجی‌های مهندسی چگونه تعریف شده است؟',
    ],
    C: [
      'مشخصات فنی اتصال ریزشبکه ۲۰/۶۳ کیلوولت و محاسبات بازیافت حرارت را بیان کنید.',
      'محدودیت‌های دمای محیطی چرخه ORC در سایت صنعتی چیست؟',
    ],
    D: [
      'بازده میدانی صحه‌گذاری‌شده راکتور انرژی پاک GMEL چقدر است؟',
      'مرزهای آزمون آزمایشگاهی TRL 4 و افت کاتالیست GMEL را تشریح فرمایید.',
    ],
    E: [
      'مرزهای ثبت اختراع راکتور GMEL در برابر پیشینه EP3429188B1 را مشخص کنید.',
      'آیا ریسک افشای اسرار تجاری در ادعاهای مربوط به نازل وجود دارد؟',
    ],
    F: [
      'مسیر بحرانی و اقلام با دوره تحویل طولانی در پروژه هاب روستایی چیست؟',
      'معیارهای دروازه مرحله‌ای نقطه عطف MS-03 فونداسیون را بررسی کنید.',
    ],
    G: [
      'خط‌مشی امنیت سایبری اتصال تله‌متری IIoT به سامانه‌های مدیریتی چیست؟',
      'آیا به‌روزرسانی ابری اسکادا بدون تاییدیه فیزیکی مجاز است؟',
    ],
    H: [
      'مبلغ ۲.۴ میلیون دلار برای خرید فوری راکتور GMEL تخصیص دهید.',
      'حساسیت نرخ بازده داخلی (IRR) نسبت به افزایش ۲۰ درصدی Capex را تحلیل نمایید.',
    ],
    I: [
      'شاخص‌های پایه کربن‌زدایی و پایداری هاب‌های صنعتی روستایی چیست؟',
      'پتانسیل کاهش CO2 و ضریب اشتغال‌زایی محلی را شرح دهید.',
    ],
    J: [
      'استاندارد حاکم بر مرزبندی‌های معرفتی هوش مصنوعی و اسناد معتبر سازمانی چیست؟',
      'استاندارد J-02 پیرامون ممنوعیت ادعاهای تأییدنشده میدانی را توضیح دهید.',
    ],
  };

  const activeSamplePrompts = isFa ? samplePromptsFa[activeModuleId] : samplePromptsEn[activeModuleId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    await onSendMessage(text, activeModuleId);
  };

  const handleExportChat = () => {
    const mdContent = messages
      .map(
        (m) =>
          `### ${m.role === 'user' ? 'USER QUERY' : 'KKM AGENT RESPONSE'} (${m.timestamp})\n**Module:** ${m.moduleId} | **Engine:** ${m.engineMode}\n\n${m.content}\n\n---`
      )
      .join('\n\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KKM-Chat-Session-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col max-w-7xl mx-auto p-4 md:p-6">
      {/* Chat Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Module Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {isFa ? 'ماژول سازمانی:' : 'Corporate Module:'}
          </label>
          <select
            value={activeModuleId}
            onChange={(e) => onModuleChange(e.target.value as ModuleId)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-500"
          >
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code} - {isFa ? m.titleFa : m.titleEn}
              </option>
            ))}
          </select>
        </div>

        {/* Engine status & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            {engineMode === 'gemini' ? (
              <span className="flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gemini Live Proxy
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                Local Knowledge Engine
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <>
                <button
                  onClick={handleExportChat}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                  title="Export Chat as Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClearChat}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 rounded text-xs transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/70 border-x border-slate-800 p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isFa ? 'کنسول هوش سازمانی KKM آماده دریافت سوال' : 'KKM Corporate Intelligence Console Ready'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                {isFa
                  ? `ماژول فعال: ${activeModule.code} (${activeModule.titleFa}). داده‌های نمونه تأییدنشده‌اند و پاسخ‌ها نباید واقعیت سازمانی تلقی شوند.`
                  : `Active Module: ${activeModule.code} (${activeModule.titleEn}). Prototype records are unverified and responses must not be treated as company facts.`}
              </p>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="w-full max-w-2xl pt-2">
              <span className="text-[11px] text-slate-500 block mb-2">
                {isFa ? 'پرسش‌های نمونه سازمانی پیشنهادی:' : 'Suggested Executive Inquiries:'}
              </span>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {activeSamplePrompts?.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(prompt);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/30 text-xs text-left transition-all"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1 px-1">
                <span className="font-medium text-slate-400">
                  {msg.role === 'user'
                    ? isFa
                      ? 'مدیر سازمانی'
                      : 'Executive'
                    : isFa
                    ? 'عامل هوش سازمانی KKM'
                    : 'KKM Intelligence Agent'}
                </span>
                <span>·</span>
                <span className="font-mono">{msg.timestamp.split('T')[1]?.slice(0, 5) || ''}</span>
                {msg.role === 'assistant' && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-amber-400/80">
                      {msg.engineMode === 'gemini' ? 'Gemini Live' : 'Local Vault Engine'}
                    </span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-4xl rounded-xl p-4 md:p-5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 text-amber-100 border border-amber-500/30 rounded-tr-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none space-y-4 shadow-lg'
                }`}
              >
                {/* Content formatted with clean Markdown-style rendering */}
                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm leading-relaxed">
                  {msg.content}
                </div>

                {/* Assistant Citations & Epistemic Tags */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                      {isFa ? 'رکوردهای نمونه ارجاع‌شده (تأییدنشده):' : 'Referenced sample records (unverified):'}
                    </span>
                    {msg.citations.map((recId) => (
                      <button
                        key={recId}
                        onClick={() => onInspectRecord(recId)}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                        title="Inspect illustrative record"
                      >
                        [{recId}]
                      </button>
                    ))}
                  </div>
                )}

                {/* Sensitive Action Approval Card (if attached to message) */}
                {msg.sensitiveActionProposal && (
                  <div className="mt-3 p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-300 font-bold text-[11px]">
                            {msg.sensitiveActionProposal.id}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                            {msg.sensitiveActionProposal.category}
                          </span>
                        </div>
                        <p className="text-white font-medium text-xs mt-0.5">
                          {msg.sensitiveActionProposal.title}
                        </p>
                        <p className="text-[11px] text-rose-200/80 mt-1">
                          {isFa
                            ? 'عملیات حساس: اجرای خودکار مسدود است و نیازمند تاییدیه صریح انسانی است.'
                            : 'Sensitive action proposed: Automated execution blocked; requires formal human authorization.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenActionReview(msg.sensitiveActionProposal!)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-semibold whitespace-nowrap transition-colors self-end sm:self-center"
                    >
                      {isFa ? 'بررسی و امضای انسانی ←' : 'Review & Sign-Off →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono animate-pulse p-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>
              {isFa
                ? 'در حال ارزیابی سوابق مستند و تحلیل معرفتی...'
                : 'Evaluating verified records & formulating epistemic decision brief...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-3 md:p-4">
        {hasError && (
          <p role="alert" className="mb-3 text-xs text-rose-300">
            {isFa
              ? 'سرویس چت در دسترس نیست. پاسخ شبیه‌سازی‌شده‌ای تولید نشده است؛ دوباره تلاش کنید یا وضعیت سرویس را بررسی کنید.'
              : 'The chat service is unavailable. No simulated answer was generated; retry or check the service status.'}
          </p>
        )}
        {/* Quick prompt suggestions when messages exist */}
        {messages.length > 0 && (
          <div className="mb-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
            <span className="text-slate-500 shrink-0">{isFa ? 'پیشنهاد:' : 'Quick Query:'}</span>
            {activeSamplePrompts?.slice(0, 2).map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p)}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 truncate max-w-xs border border-slate-800 transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={
              isFa
                ? `پرسش یا موضوع تصمیم‌گیری در ماژول ${activeModule.code} را وارد فرمایید...`
                : `Enter executive decision inquiry or policy check for Module ${activeModule.code}...`
            }
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500/80 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isFa ? 'ارسال' : 'Submit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
