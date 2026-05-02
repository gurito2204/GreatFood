const getDb = require("../db").getDb;

const FLAVORS = ["salty", "sweet", "sour", "bitter", "spicy"];

/**
 * calibrateScore — Mean-Centering Calibration
 * 
 * Spec: calibrated = rawScore + (globalAvg - userBias) * WEIGHT
 * Where userBias = B_u = avg(R_u,i - S̄_i) per flavor
 * 
 * If user tends to rate higher than average (positive bias),
 * we subtract to normalize. Scale: 1-10.
 */
function calibrateScore(rawScore, userBias) {
  const WEIGHT = 0.5;
  const calibratedScore = rawScore - (userBias * WEIGHT);
  return Math.min(10, Math.max(1, Math.round(calibratedScore * 10) / 10));
}

module.exports = getRatings = async (itemId) => {
  try {
    const connection = await getDb();

    const ratings = await connection.collection("foodRatings").find({ itemId }).toArray();

    if (ratings.length === 0) return null;

    let sums = {};
    let counts = {};
    for (const f of FLAVORS) { sums[f] = 0; counts[f] = 0; }

    for (const r of ratings) {
      // Get user's taste bias
      const user = await connection.collection("users").findOne({ id: r.userId });
      const tasteHistory = user?.tasteHistory || {};

      for (const flavor of FLAVORS) {
        if (r.ratings[flavor] != null) {
          const userBias = tasteHistory[flavor]?.bias ?? 0;
          sums[flavor] += calibrateScore(r.ratings[flavor], userBias);
          counts[flavor]++;
        }
      }
    }

    const result = {};
    for (const flavor of FLAVORS) {
      result[flavor] = counts[flavor]
        ? Math.round((sums[flavor] / counts[flavor]) * 10) / 10
        : 0;
    }

    return result;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
