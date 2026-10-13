import assert from 'node:assert/strict';
import test from 'node:test';
import { runSystemEvaluation } from './evaluateHandler';

test('system evaluation checks each expected prototype behavior', () => {
  const result = runSystemEvaluation();

  assert.equal(result.totalTests, 4);
  assert.equal(result.passedTests, 4);
  assert.equal(result.warningTests, 0);
  assert.equal(result.failedTests, 0);
  assert.ok(result.cases.every((testCase) => testCase.result === 'passed'));
});
