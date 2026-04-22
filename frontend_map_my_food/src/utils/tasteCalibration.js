/**
 * Mock user taste profile
 */
const MOCK_USER_TASTE_PROFILE = {
    userId: "user_123",
    tasteHistory: {
      salty: { avgRating: 2.1, bias: "under" },
      sweet: { avgRating: 4.2, bias: "over" },
      sour:  { avgRating: 3.0, bias: "neutral" },
      bitter:{ avgRating: 2.8, bias: "neutral" }
    }
  };
  
  const GLOBAL_AVERAGE = {
    salty: 3.0,
    sweet: 3.0,
    sour: 3.0,
    bitter: 3.0,
  };
  
  export function calibrateScore(rawScore, flavorType, userAvg) {
    const WEIGHT = 0.5; // Calibration impact factor
    
    const finalUserAvg = userAvg ?? 3.0;
    const globalAvg = GLOBAL_AVERAGE[flavorType];
    
    // Bias is how far off the user is from the global average
    const bias = globalAvg - finalUserAvg;
    
    const calibratedScore = rawScore + (bias * WEIGHT);
    
    return Math.min(5, Math.max(1, Math.round(calibratedScore * 10) / 10));
  }
