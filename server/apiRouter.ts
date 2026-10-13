/**
 * KKM Corporate Intelligence Agent v3.0
 * Unified API Router & Request Dispatcher
 *
 * Can be mounted in Vite development middleware, Express server, or Serverless handlers.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleChatRequest } from './api/chatHandler';
import { generateStructuredReport, reportToMarkdown } from './api/reportHandler';
import { runSystemEvaluation } from './api/evaluateHandler';
import { EVIDENCE_RECORDS, MODULES } from '../src/data/evidenceRepository';

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = req.url || '';

  // Only handle /api/agent/* routes
  if (!url.startsWith('/api/agent/')) {
    return false;
  }

  const endpoint = url.replace('/api/agent/', '').split('?')[0];

  try {
    if (endpoint === 'chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleChatRequest(body);
      sendJson(res, 200, result);
      return true;
    }

    if (endpoint === 'report' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const report = generateStructuredReport(body);
      const markdown = reportToMarkdown(report);
      sendJson(res, 200, { report, markdown });
      return true;
    }

    if (endpoint === 'evaluate' && (req.method === 'GET' || req.method === 'POST')) {
      const evaluation = runSystemEvaluation();
      sendJson(res, 200, evaluation);
      return true;
    }

    if (endpoint === 'evidence' && req.method === 'GET') {
      sendJson(res, 200, { records: EVIDENCE_RECORDS, modules: MODULES });
      return true;
    }

    if (endpoint === 'health' && req.method === 'GET') {
      sendJson(res, 200, {
        status: 'online',
        service: 'KKM Corporate Intelligence Agent v3.0 API',
        prototypeMode: true,
        timestamp: new Date().toISOString(),
      });
      return true;
    }

    sendJson(res, 404, { error: `Endpoint not found: ${endpoint}` });
    return true;
  } catch (error: any) {
    console.error('[KKM API Router Error]', error);
    sendJson(res, 500, { error: error?.message || 'Internal Server Error' });
    return true;
  }
}
