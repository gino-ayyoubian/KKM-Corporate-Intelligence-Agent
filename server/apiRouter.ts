/**
 * KKM Corporate Intelligence Agent v3.0
 * Unified API Router & Request Dispatcher
 *
 * Can be mounted in Vite development middleware, Express server, or Serverless handlers.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { timingSafeEqual } from 'crypto';
import { ChatRequestPayload, handleChatRequest } from './api/chatHandler';
import { generateStructuredReport, reportToMarkdown, ReportRequestPayload } from './api/reportHandler';
import { runSystemEvaluation } from './api/evaluateHandler';
import { EVIDENCE_RECORDS, MODULES } from '../src/data/evidenceRepository';

const MAX_BODY_BYTES = 64 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const RATE_LIMIT_MAX_CLIENTS = 10_000;
const requestCounts = new Map<string, { windowStart: number; count: number }>();

class ApiRequestError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
  }
}

function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const contentLength = Number(req.headers['content-length']);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      reject(new ApiRequestError('Request body is too large', 413));
      req.resume();
      return;
    }

    const chunks: Buffer[] = [];
    let bodyBytes = 0;
    let settled = false;
    req.on('data', (chunk) => {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bodyBytes += buffer.length;
      if (bodyBytes > MAX_BODY_BYTES) {
        settled = true;
        chunks.length = 0;
        reject(new ApiRequestError('Request body is too large', 413));
        return;
      }
      chunks.push(buffer);
    });
    req.on('end', () => {
      if (settled) return;
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new ApiRequestError('Malformed JSON request body', 400));
      }
    });
    req.on('error', (error) => reject(error));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function hasApiAccess(req: IncomingMessage): boolean {
  const configuredToken = process.env.KKM_API_TOKEN;
  if (!configuredToken) return process.env.NODE_ENV === 'development';

  const authorization = req.headers.authorization || '';
  const suppliedToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const expectedBytes = Buffer.from(configuredToken);
  const suppliedBytes = Buffer.from(suppliedToken);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

function isRateLimited(req: IncomingMessage): boolean {
  const now = Date.now();
  const client = req.socket?.remoteAddress || 'unknown';
  let entry = requestCounts.get(client);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    if (!entry && requestCounts.size >= RATE_LIMIT_MAX_CLIENTS) {
      for (const [key, value] of requestCounts) {
        if (now - value.windowStart >= RATE_LIMIT_WINDOW_MS) requestCounts.delete(key);
      }
      if (requestCounts.size >= RATE_LIMIT_MAX_CLIENTS) return true;
    }
    entry = { windowStart: now, count: 0 };
    requestCounts.set(client, entry);
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isModuleId(value: unknown): value is (typeof MODULES)[number]['id'] {
  return typeof value === 'string' && MODULES.some((module) => module.id === value);
}

function isLanguage(value: unknown): value is 'en' | 'fa' {
  return value === 'en' || value === 'fa';
}

function validateChatPayload(body: unknown): body is ChatRequestPayload {
  return isObject(body) &&
    typeof body.prompt === 'string' &&
    body.prompt.trim().length > 0 &&
    body.prompt.length <= 10_000 &&
    isModuleId(body.moduleId) &&
    isLanguage(body.language) &&
    (body.mode === 'gemini' || body.mode === 'simulated');
}

function validateReportPayload(body: unknown): body is ReportRequestPayload {
  return isObject(body) &&
    (body.title === undefined || (typeof body.title === 'string' && body.title.length <= 200)) &&
    isModuleId(body.moduleId) &&
    isLanguage(body.language) &&
    (body.customContext === undefined ||
      (typeof body.customContext === 'string' && body.customContext.length <= 4_000));
}

function hasJsonContentType(req: IncomingMessage): boolean {
  return (req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase() === 'application/json';
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

  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'Too many requests' });
    return true;
  }

  if (!hasApiAccess(req)) {
    const statusCode = process.env.NODE_ENV !== 'development' && !process.env.KKM_API_TOKEN ? 503 : 401;
    sendJson(res, statusCode, {
      error: statusCode === 503 ? 'API authentication is not configured' : 'Unauthorized',
    });
    return true;
  }

  const endpoint = url.replace('/api/agent/', '').split('?')[0];

  try {
    if (endpoint === 'chat' && req.method === 'POST') {
      if (!hasJsonContentType(req)) {
        sendJson(res, 415, { error: 'Content-Type must be application/json' });
        return true;
      }
      const body = await parseJsonBody(req);
      if (!validateChatPayload(body)) {
        sendJson(res, 400, { error: 'Invalid chat request' });
        return true;
      }
      const result = await handleChatRequest(body);
      sendJson(res, 200, result);
      return true;
    }

    if (endpoint === 'report' && req.method === 'POST') {
      if (!hasJsonContentType(req)) {
        sendJson(res, 415, { error: 'Content-Type must be application/json' });
        return true;
      }
      const body = await parseJsonBody(req);
      if (!validateReportPayload(body)) {
        sendJson(res, 400, { error: 'Invalid report request' });
        return true;
      }
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
    const statusCode = error instanceof ApiRequestError ? error.statusCode : 500;
    if (statusCode === 500) console.error('[KKM API Router Error]', error);
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;
    sendJson(res, statusCode, { error: message });
    return true;
  }
}
