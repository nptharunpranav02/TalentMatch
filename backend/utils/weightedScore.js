const calculateWeightedScore = (breakdown = {}, requestedWeights = {}, hasPreferredInterests = true) => {
  const rawWeights = {
    skill: Number(requestedWeights.skillWeight ?? 60),
    experience: Number(requestedWeights.experienceWeight ?? 25),
    aspiration: Number(requestedWeights.interestWeight ?? 15)
  };
  const validWeights = Object.values(rawWeights).every(Number.isFinite)
    && Object.values(rawWeights).every((value) => value >= 0);
  const weightsTotal = validWeights
    ? Object.values(rawWeights).reduce((sum, value) => sum + value, 0)
    : 0;
  const weights = weightsTotal > 0 ? rawWeights : { skill: 60, experience: 25, aspiration: 15 };
  const denominator = weightsTotal > 0 ? weightsTotal : 100;
  const skill = Number(breakdown.skill_score || 0) * weights.skill / denominator;
  const experience = Number(breakdown.experience_score || 0) * weights.experience / denominator;
  const aspirationRaw = hasPreferredInterests
    ? (Number(breakdown.availability_score || 0) + Number(breakdown.interest_score || 0)) / 2
    : Number(breakdown.availability_score || 0);
  const aspiration = aspirationRaw * weights.aspiration / denominator;
  const contributions = {
    technicalFit: Math.round(skill * 100) / 100,
    experienceFit: Math.round(experience * 100) / 100,
    aspirationFit: Math.round(aspiration * 100) / 100
  };
  const rawTotal = Object.values(contributions).reduce((sum, value) => sum + value, 0);
  const score = Math.round(rawTotal);
  // Keep the displayed component contributions mathematically reconciled
  // with the integer headline score after rounding.
  contributions.aspirationFit = Math.round((contributions.aspirationFit + score - rawTotal) * 100) / 100;
  return { scoreBreakdown: contributions, score };
};

module.exports = calculateWeightedScore;
