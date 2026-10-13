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

    const systemInstruction = `You are a prototype assistant for module ${moduleId}. No company records or independently verified facts are supplied.
Do not invent company data, financial figures, legal or patent status, technical results, named owners, or completed actions. State when evidence is unavailable. Do not claim that an answer or individual claim is verified or cite record identifiers. Distinguish user-provided information from established facts.
Respond in ${language === 'fa' ? 'Persian' : 'English'}. If a request proposes a sensitive operation, state that automated execution is blocked and human review is required.`;

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
    // Also derive epistemic breakdown and detect sensitive action
    const localAnalysis = generateCorporateIntelligenceResponse(prompt, moduleId, language);

    return {
      reply: replyText,
      citations: [],
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
