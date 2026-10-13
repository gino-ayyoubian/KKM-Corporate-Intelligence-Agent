/**
 * KKM Corporate Intelligence Agent v3.0
 * Main Application Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { PrototypeBanner } from './components/PrototypeBanner';
import { Sidebar, ViewKey } from './components/Sidebar';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { HumanApprovalModal } from './components/HumanApprovalModal';

import { ExecutiveOverviewView } from './views/ExecutiveOverviewView';
import { ChatView } from './views/ChatView';
import { EvidenceStoreView } from './views/EvidenceStoreView';
import { ReportBuilderView } from './views/ReportBuilderView';
import { PortfolioView } from './views/PortfolioView';
import { GovernanceCenterView } from './views/GovernanceCenterView';
import { EvaluationView } from './views/EvaluationView';

import {
  Language,
  EngineMode,
  ModuleId,
  ChatMessage,
  EvidenceRecord,
  SensitiveAction,
} from './types';
import {
  MODULES,
  EVIDENCE_RECORDS,
  INITIAL_SENSITIVE_ACTIONS,
} from './data/evidenceRepository';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [engineMode, setEngineMode] = useState<EngineMode>('gemini');
  const [currentView, setCurrentView] = useState<ViewKey>('overview');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('D');

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [inspectedRecord, setInspectedRecord] = useState<EvidenceRecord | null>(null);
  const [actionToReview, setActionToReview] = useState<SensitiveAction | null>(null);

  const [actionsList, setActionsList] = useState<SensitiveAction[]>(INITIAL_SENSITIVE_ACTIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [apiAccessGranted, setApiAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState(false);

  // Sync document direction and lang attribute with selected language
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const activeModule = MODULES.find((m) => m.id === activeModuleId) || MODULES[0];

  const handleApiAccess = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = apiToken.trim();
    try {
      const response = await fetch('/api/agent/health', {
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      });
      if (!response.ok) throw new Error('API access denied');
      setApiToken(token);
      setApiAccessGranted(true);
      setAccessError(false);
    } catch {
      setAccessError(true);
    }
  };

  const viewTitles: Record<ViewKey, { en: string; fa: string }> = {
    overview: { en: 'Executive Overview', fa: 'داشبورد مدیریتی' },
    chat: { en: 'Intelligence Inquiries', fa: 'پرسش و پاسخ هوشمند' },
    evidence: { en: 'Controlled Evidence Repository', fa: 'مخزن شواهد و اسناد' },
    reports: { en: 'Structured Report Generator', fa: 'تولید گزارش ساختاریافته' },
    portfolio: { en: 'Technology Readiness Portfolio', fa: 'پورتفولیوی آمادگی فناوری' },
    governance: { en: 'Human Approval & Governance', fa: 'مرکز تایید و حاکمیت انسانی' },
    evaluation: { en: 'Evaluation & Security Console', fa: 'آزمون‌ها و امنیت سیستم' },
  };

  const handleSendMessage = async (text: string, moduleId: ModuleId) => {
    const userMessage: ChatMessage = {
      id: `USR-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toISOString(),
      moduleId,
      content: text,
      engineMode,
      citations: [],
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);
    setChatError(false);

    try {
      // Call server API endpoint
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiToken ? { Authorization: 'Bearer ' + apiToken } : {}),
        },
        body: JSON.stringify({
          prompt: text,
          moduleId,
          language,
          mode: engineMode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: `AST-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          moduleId,
          content: data.reply,
          engineMode: data.engineUsed || engineMode,
          citations: data.citations || [],
          epistemicBreakdown: data.epistemicBreakdown,
          sensitiveActionProposal: data.sensitiveActionProposal,
        };

        // If a sensitive action was proposed, append to actionsList
        if (data.sensitiveActionProposal) {
          setActionsList((prev) => {
            if (prev.some((a) => a.id === data.sensitiveActionProposal.id)) return prev;
            return [data.sensitiveActionProposal, ...prev];
          });
        }

        setChatMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('[KKM Client] Chat API request failed:', err);
      setChatError(true);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleActionDecision = (
    actionId: string,
    decision: 'approved' | 'rejected',
    signer: string,
    notes: string
  ) => {
    setActionsList((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          return {
            ...act,
            status: decision,
            decidedAt: new Date().toISOString(),
            decidedBy: signer,
            notes,
          };
        }
        return act;
      })
    );
  };

  const handleInspectRecordById = (recordId: string) => {
    const found = EVIDENCE_RECORDS.find((r) => r.recordId === recordId);
    if (found) {
      setInspectedRecord(found);
    }
  };

  const pendingApprovalsCount = actionsList.filter((a) => a.status === 'pending').length;

  if (!apiAccessGranted) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" dir={language === 'fa' ? 'rtl' : 'ltr'}>
        <form onSubmit={handleApiAccess} className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{language === 'fa' ? 'دسترسی API' : 'API Access'}</h1>
            <button type="button" onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')} className="text-xs text-amber-300">
              {language === 'fa' ? 'English' : 'فارسی'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'fa'
              ? 'برای اعتبارسنجی دسترسی، توکن API را وارد کنید. توکن در مرورگر ذخیره نمی‌شود.'
              : 'Enter the API access token to validate access. The token is kept in memory and is not stored in the browser.'}
          </p>
          <input
            type="password"
            autoComplete="current-password"
            value={apiToken}
            onChange={(event) => setApiToken(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            aria-label={language === 'fa' ? 'توکن API' : 'API token'}
          />
          {accessError && (
            <p role="alert" className="text-xs text-rose-300">
              {language === 'fa' ? 'دسترسی API تأیید نشد.' : 'API access could not be verified.'}
            </p>
          )}
          <button type="submit" className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">
            {language === 'fa' ? 'ادامه' : 'Continue'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* 1. Global Prototype Banner */}
      {!bannerDismissed && (
        <PrototypeBanner
          language={language}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* 2. Top Navigation Bar (3-Zone Contract) */}
      <TopBar
        language={language}
        onLanguageChange={setLanguage}
        engineMode={engineMode}
        onEngineModeChange={setEngineMode}
        activeViewTitle={viewTitles[currentView][language]}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          language={language}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentView === 'overview' && (
            <ExecutiveOverviewView
              language={language}
              onNavigate={setCurrentView}
              onSelectModuleForChat={(modId) => {
                setActiveModuleId(modId);
                setCurrentView('chat');
              }}
              pendingActions={actionsList}
              onOpenActionReview={(action) => setActionToReview(action)}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              language={language}
              engineMode={engineMode}
              activeModuleId={activeModuleId}
              onModuleChange={setActiveModuleId}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              hasError={chatError}
              onInspectRecord={handleInspectRecordById}
              onOpenActionReview={(action) => setActionToReview(action)}
              onClearChat={() => {
                setChatMessages([]);
                setChatError(false);
              }}
            />
          )}

          {currentView === 'evidence' && (
            <EvidenceStoreView
              language={language}
              onInspectRecord={(rec) => setInspectedRecord(rec)}
            />
          )}

          {currentView === 'reports' && (
            <ReportBuilderView
              language={language}
              apiToken={apiToken}
              onInspectRecord={handleInspectRecordById}
            />
          )}

          {currentView === 'portfolio' && (
            <PortfolioView language={language} />
          )}

          {currentView === 'governance' && (
            <GovernanceCenterView
              language={language}
              actions={actionsList}
              onOpenReviewModal={(action) => setActionToReview(action)}
            />
          )}

          {currentView === 'evaluation' && (
            <EvaluationView language={language} apiToken={apiToken} />
          )}
        </main>
      </div>

      {/* 4. Slide-Over Evidence Inspector Drawer */}
      <EvidenceDrawer
        record={inspectedRecord}
        onClose={() => setInspectedRecord(null)}
        language={language}
      />

      {/* 5. Human Sign-Off Modal */}
      <HumanApprovalModal
        action={actionToReview}
        isOpen={Boolean(actionToReview)}
        onClose={() => setActionToReview(null)}
        onDecide={handleActionDecision}
        language={language}
      />
    </div>
  );
}
