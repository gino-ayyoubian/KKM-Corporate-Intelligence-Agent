import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { after, before, test } from 'node:test';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleApiRequest } from '../apiRouter';

const originalNodeEnv = process.env.NODE_ENV;
before(() => {
  process.env.NODE_ENV = 'development';
});
after(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
});

function makeRequest(
  url: string,
  body: string,
  contentType = 'application/json',
  authorization?: string,
  method = 'POST',
  remoteAddress = '127.0.0.1'
): IncomingMessage {
  const request = Readable.from([Buffer.from(body)]) as IncomingMessage;
  Object.assign(request, {
    url,
    method,
    headers: {
      'content-type': contentType,
      'content-length': Buffer.byteLength(body),
      ...(authorization ? { authorization } : {}),
    },
  });
  Object.defineProperty(request, 'socket', { value: { remoteAddress } });
  return request;
}

function makeResponse() {
  const response = {
    statusCode: 200,
    body: '',
    setHeader() {},
    end(data: string) {
      response.body = data;
    },
  };
  return response as unknown as ServerResponse & { body: string };
}

test('rejects malformed JSON and invalid payload fields', async () => {
  const malformed = makeResponse();
  await handleApiRequest(makeRequest('/api/agent/chat', '{'), malformed);
  assert.equal(malformed.statusCode, 400);

  const invalid = makeResponse();
  await handleApiRequest(
    makeRequest('/api/agent/chat', JSON.stringify({
      prompt: 'Question',
      moduleId: 'unknown',
      language: 'en',
      mode: 'simulated',
    })),
    invalid
  );
  assert.equal(invalid.statusCode, 400);
});

test('rejects request bodies larger than the configured limit', async () => {
  const body = JSON.stringify({ prompt: 'x'.repeat(70 * 1024) });
  const response = makeResponse();
  await handleApiRequest(makeRequest('/api/agent/chat', body), response);
  assert.equal(response.statusCode, 413);
});

test('requires JSON content type for API POST requests', async () => {
  const response = makeResponse();
  await handleApiRequest(
    makeRequest('/api/agent/report', '{}', 'text/plain'),
    response
  );
  assert.equal(response.statusCode, 415);
});

test('requires the configured bearer token', async () => {
  const originalToken = process.env.KKM_API_TOKEN;
  process.env.KKM_API_TOKEN = 'example-test-token';
  try {
    const unauthorized = makeResponse();
    await handleApiRequest(makeRequest('/api/agent/health', '', 'application/json', undefined, 'GET'), unauthorized);
    assert.equal(unauthorized.statusCode, 401);

    const authorized = makeResponse();
    await handleApiRequest(
      makeRequest('/api/agent/health', '', 'application/json', 'Bearer ' + 'example-test-token', 'GET'),
      authorized
    );
    assert.equal(authorized.statusCode, 200);
  } finally {
    if (originalToken === undefined) delete process.env.KKM_API_TOKEN;
    else process.env.KKM_API_TOKEN = originalToken;
  }
});

test('fails closed outside development when no API token is configured', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalToken = process.env.KKM_API_TOKEN;
  process.env.NODE_ENV = 'production';
  delete process.env.KKM_API_TOKEN;
  try {
    const response = makeResponse();
    await handleApiRequest(makeRequest('/api/agent/health', '', 'application/json', undefined, 'GET', 'production-test'), response);
    assert.equal(response.statusCode, 503);
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalToken === undefined) delete process.env.KKM_API_TOKEN;
    else process.env.KKM_API_TOKEN = originalToken;
  }
});

test('limits API requests per client IP', async () => {
  let statusCode = 0;
  for (let requestNumber = 0; requestNumber <= 120; requestNumber += 1) {
    const response = makeResponse();
    await handleApiRequest(
      makeRequest('/api/agent/health', '', 'application/json', undefined, 'GET', 'rate-limit-test'),
      response
    );
    statusCode = response.statusCode;
  }
  assert.equal(statusCode, 429);
});
