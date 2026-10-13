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
import { generateCorporateIntelligenceResponse } from '../server/knowledgeEngine';

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

  // Sync document direction and lang attribute with selected language
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const activeModule = MODULES.find((m) => m.id === activeModuleId) || MODULES[0];

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

    try {
      // Call server API endpoint
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.warn('[KKM Client] Direct API call fallback to local engine:', err);
      // Seamless client-side fallback
      const localResult = generateCorporateIntelligenceResponse(text, moduleId, language);
      const assistantMessage: ChatMessage = {
        id: `AST-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        moduleId,
        content: localResult.content,
        engineMode: 'simulated',
        citations: localResult.citations,
        epistemicBreakdown: localResult.epistemicBreakdown,
        sensitiveActionProposal: localResult.sensitiveActionProposal,
      };

      if (localResult.sensitiveActionProposal) {
        setActionsList((prev) => {
          if (prev.some((a) => a.id === localResult.sensitiveActionProposal!.id)) return prev;
          return [localResult.sensitiveActionProposal!, ...prev];
        });
      }

      setChatMessages((prev) => [...prev, assistantMessage]);
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
              onInspectRecord={handleInspectRecordById}
              onOpenActionReview={(action) => setActionToReview(action)}
              onClearChat={() => setChatMessages([])}
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
            <EvaluationView language={language} />
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
