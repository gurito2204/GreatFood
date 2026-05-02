/**
 * Taste Calibration — Mean-Centering (Scale 1-10)
 *
 * calibrateScore takes:
 *   - rawScore: user's raw rating for this flavor (1-10)
 *   - userBias: B_u for this flavor (from tasteHistory)
 *
 * Returns calibrated score clamped to [1, 10].
 */
export function calibrateScore(rawScore, flavorType, userBias) {
  const WEIGHT = 0.5;
  const finalBias = userBias ?? 0;
  const calibratedScore = rawScore - (finalBias * WEIGHT);
  return Math.min(10, Math.max(1, Math.round(calibratedScore * 10) / 10));
}
