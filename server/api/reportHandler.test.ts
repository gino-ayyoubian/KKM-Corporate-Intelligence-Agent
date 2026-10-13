import assert from 'node:assert/strict';
import test from 'node:test';
import { generateStructuredReport, reportToMarkdown } from './reportHandler';

test('reports preserve supplied context as unverified input and do not invent findings', () => {
  const context = 'Illustrative budget: $1.5M';
  const report = generateStructuredReport({
    title: 'Prototype review',
    moduleId: 'D',
    language: 'en',
    customContext: context,
  });

  assert.equal(report.status, 'Draft');
  assert.match(report.executiveConclusion, /User-provided context \(unverified\)/);
  assert.ok(report.executiveConclusion.includes(context));
  assert.deepEqual(report.strategicAlternatives, []);
  assert.deepEqual(report.riskMatrix, []);
  assert.deepEqual(report.actionPlan, []);
  assert.ok(report.referencedEvidence.length > 0);

  const markdown = reportToMarkdown(report);
  assert.match(markdown, /Referenced sample records \(unverified\)/);
  assert.match(markdown, /Illustrative; not independently verified/);
  assert.doesNotMatch(markdown, /Verified Record:/);
});

test('reports remain a draft without user context', () => {
  const report = generateStructuredReport({
    moduleId: 'D',
    language: 'fa',
  });

  assert.equal(report.status, 'Draft');
  assert.doesNotMatch(report.executiveConclusion, /User-provided context/);
  assert.equal(report.requiresHumanApproval, true);
});
