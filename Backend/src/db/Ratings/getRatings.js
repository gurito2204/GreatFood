const getDb = require("../db").getDb;

const GLOBAL_AVERAGE = {
  salty: 3.0,
  sweet: 3.0,
  sour: 3.0,
  bitter: 3.0,
};

function calibrateScore(rawScore, flavorType, userAvg) {
  const WEIGHT = 0.5;
  const globalAvg = GLOBAL_AVERAGE[flavorType];
  const bias = globalAvg - (userAvg ?? 3.0);
  const calibratedScore = rawScore + (bias * WEIGHT);
  return Math.min(5, Math.max(1, Math.round(calibratedScore * 10) / 10));
}

module.exports = getRatings = async (itemId) => {
  try {
    const connection = await getDb();
    
    const ratings = await connection.collection("foodRatings").find({ itemId }).toArray();
    
    if (ratings.length === 0) return null;

    let sums = { salty: 0, sweet: 0, sour: 0, bitter: 0 };
    let counts = { salty: 0, sweet: 0, sour: 0, bitter: 0 };

    for (const r of ratings) {
      const user = await connection.collection("users").findOne({ id: r.userId });
      const tasteHistory = user?.tasteHistory || {};

      if (r.ratings.salty) {
        sums.salty += calibrateScore(r.ratings.salty, 'salty', tasteHistory.salty?.avgRating);
        counts.salty++;
      }
      if (r.ratings.sweet) {
        sums.sweet += calibrateScore(r.ratings.sweet, 'sweet', tasteHistory.sweet?.avgRating);
        counts.sweet++;
      }
      if (r.ratings.sour) {
        sums.sour += calibrateScore(r.ratings.sour, 'sour', tasteHistory.sour?.avgRating);
        counts.sour++;
      }
      if (r.ratings.bitter) {
        sums.bitter += calibrateScore(r.ratings.bitter, 'bitter', tasteHistory.bitter?.avgRating);
        counts.bitter++;
      }
    }

    return {
      salty: counts.salty ? Math.round((sums.salty / counts.salty) * 10) / 10 : 0,
      sweet: counts.sweet ? Math.round((sums.sweet / counts.sweet) * 10) / 10 : 0,
      sour:  counts.sour ? Math.round((sums.sour / counts.sour) * 10) / 10 : 0,
      bitter:counts.bitter ? Math.round((sums.bitter / counts.bitter) * 10) / 10 : 0,
    };
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
