/**
 * KKM Corporate Intelligence Agent v3.0
 * Server-Side Chat Handler
 *
 * Calls @google/genai via secure server proxy or falls back to
 * the local corporate knowledge engine. Never exposes API key to client.
 */

import { GoogleGenAI } from '@google/genai';
import { SERVER_CONFIG } from '../config';
import { generateCorporateIntelligenceResponse } from '../knowledgeEngine';
import { ModuleId, Language, ChatMessage } from '../../src/types';
import { EVIDENCE_RECORDS, MODULES } from '../../src/data/evidenceRepository';

export interface ChatRequestPayload {
  prompt: string;
  moduleId: ModuleId;
  language: Language;
  mode: 'gemini' | 'simulated';
}

export interface ChatResponsePayload {
  reply: string;
  citations: string[];
  epistemicBreakdown: any;
  sensitiveActionProposal?: any;
  engineUsed: 'gemini' | 'simulated';
  modelName: string;
}

export async function handleChatRequest(
  payload: ChatRequestPayload
): Promise<ChatResponsePayload> {
  const { prompt, moduleId, language, mode } = payload;
  const selectedModule = MODULES.find((m) => m.id === moduleId) || MODULES[0];

  // If user requested simulated mode or if server has no Gemini API key, use local knowledge engine
  if (mode === 'simulated' || !SERVER_CONFIG.GEMINI_API_KEY) {
    const localResult = generateCorporateIntelligenceResponse(prompt, moduleId, language);
    return {
      reply: localResult.content,
      citations: localResult.citations,
      epistemicBreakdown: localResult.epistemicBreakdown,
      sensitiveActionProposal: localResult.sensitiveActionProposal,
      engineUsed: 'simulated',
      modelName: 'Local Corporate Knowledge Engine',
    };
  }

  // Attempt live Gemini call via server SDK
  try {
    const ai = new GoogleGenAI({
      apiKey: SERVER_CONFIG.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const relevantDocs = EVIDENCE_RECORDS.filter((r) => r.moduleId === moduleId).slice(0, 3);
    const docContext = relevantDocs
      .map(
        (d) =>
          `[RECORD ${d.recordId}] Title: ${d.titleEn} / ${d.titleFa} | Date: ${d.date} | Status: ${d.verificationStatus} | Confidence: ${d.confidenceScore}%\nScope: ${d.scopeLimitationsEn}\nExcerpt: "${d.fullExcerptEn}"`
      )
      .join('\n\n');

    const systemInstruction = `You are KKM Corporate Intelligence Agent v3.0, internal AI assistant for KKM International Group and Kimia Karan Mad.
MISSION: Support executive decision-making, corporate strategy, engineering, R&D, IP management, project management, and commercialization.

OPERATING PRINCIPLES:
1. Treat verified company records as authoritative only within their documented scope and date.
2. Distinguish verified facts, user-provided info, assumptions, estimates, recommendations, and open issues.
3. Never invent company data, legal status, patent status, financial figures, or field validation results.
4. Default to Persian for Persian requests and English for English requests.
5. Structure answers as: 
   1. Executive conclusion 
   2. Verified evidence and sources (cite Record IDs like KKM-ENG-2025-014)
   3. Analysis and alternatives
   4. Risks and limitations
   5. Recommendation
   6. Action plan (with owner, dependencies, and acceptance criteria)
   7. Open issues and required approvals.
6. If the request proposes sensitive operations (capex allocation, patent filing, unattended field tests, or modifying production systems), explicitly state that automated execution is blocked and requires human review approval.

RELEVANT KKM CONTROLLED RECORDS:
${docContext}`;

    const response = await ai.models.generateContent({
      model: SERVER_CONFIG.GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: SERVER_CONFIG.TEMPERATURE,
        maxOutputTokens: SERVER_CONFIG.MAX_OUTPUT_TOKENS,
      },
    });

    const replyText = response.text || '';
    const citations = relevantDocs.map((d) => d.recordId);
    
    // Also derive epistemic breakdown and detect sensitive action
    const localAnalysis = generateCorporateIntelligenceResponse(prompt, moduleId, language);

    return {
      reply: replyText,
      citations: citations.length > 0 ? citations : localAnalysis.citations,
      epistemicBreakdown: localAnalysis.epistemicBreakdown,
      sensitiveActionProposal: localAnalysis.sensitiveActionProposal,
      engineUsed: 'gemini',
      modelName: SERVER_CONFIG.GEMINI_MODEL,
    };
  } catch (err) {
    console.warn('[KKM Server] Live Gemini call encountered error, falling back to local engine:', err);
    // Graceful fallback to local engine
    const localResult = generateCorporateIntelligenceResponse(prompt, moduleId, language);
    return {
      reply: localResult.content,
      citations: localResult.citations,
      epistemicBreakdown: localResult.epistemicBreakdown,
      sensitiveActionProposal: localResult.sensitiveActionProposal,
      engineUsed: 'simulated',
      modelName: 'Local Corporate Knowledge Engine (Fallback)',
    };
  }
}
