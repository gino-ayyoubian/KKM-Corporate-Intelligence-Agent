import type { DecisionReport, EvaluationResult, Language, ModuleId } from '../types';

export interface ReportRequestPayload {
  title?: string;
  moduleId: ModuleId;
  language: Language;
  customContext?: string;
}

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', 'Bearer ' + token);
  const response = await fetch(path, {
    ...init,
    headers,
  });
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function generateReport(payload: ReportRequestPayload, token: string) {
  return request<{ report: DecisionReport; markdown: string }>('/api/agent/report', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function runEvaluation(token: string) {
  return request<EvaluationResult>('/api/agent/evaluate', token);
}
