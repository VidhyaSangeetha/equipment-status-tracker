const { expect } = require('chai');

function withinMillis(actual, targetMs) {
  expect(actual, `Expected response in <= ${targetMs} ms, got ${actual} ms`).to.be.at.most(targetMs);
}

function p95(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

module.exports = { withinMillis, p95 };