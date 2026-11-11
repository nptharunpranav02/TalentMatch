const test = require("node:test");
const assert = require("node:assert/strict");
const calculateWeightedScore = require("../utils/weightedScore");

const sample = { skill_score: 100, experience_score: 80, availability_score: 60, interest_score: 40 };

test("default weights produce contributions that reconcile to the headline", () => {
  const result = calculateWeightedScore(sample);
  assert.deepEqual(result.scoreBreakdown, { technicalFit: 60, experienceFit: 20, aspirationFit: 8 });
  assert.equal(result.score, 88);
});

test("custom weights are normalized when they do not total 100", () => {
  const result = calculateWeightedScore(sample, { skillWeight: 2, experienceWeight: 1, interestWeight: 1 });
  assert.equal(result.score, 83);
});

test("no project interest preferences do not penalize the score", () => {
  const result = calculateWeightedScore(sample, {}, false);
  assert.equal(result.scoreBreakdown.aspirationFit, 9);
});

test("invalid negative weights fall back to defaults", () => {
  const result = calculateWeightedScore(sample, { skillWeight: -1 });
  assert.equal(result.score, 88);
});

test("zero total weights fall back to defaults", () => {
  const result = calculateWeightedScore(sample, { skillWeight: 0, experienceWeight: 0, interestWeight: 0 });
  assert.equal(result.score, 88);
});
