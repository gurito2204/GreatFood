const getDb = require("../db").getDb;

module.exports = insertRating = async (userId, itemId, ratings) => {
  try {
    const connection = await getDb();
    
    // 1. Insert/Update the rating in foodRatings collection
    await connection.collection("foodRatings").updateOne(
      { userId, itemId },
      { $set: { ratings, updatedAt: new Date() } },
      { upsert: true }
    );

    // 2. Recalculate user's taste history
    const userRatings = await connection.collection("foodRatings").find({ userId }).toArray();
    
    let sums = { salty: 0, sweet: 0, sour: 0, bitter: 0 };
    let counts = { salty: 0, sweet: 0, sour: 0, bitter: 0 };

    userRatings.forEach(r => {
      if (r.ratings.salty) { sums.salty += r.ratings.salty; counts.salty++; }
      if (r.ratings.sweet) { sums.sweet += r.ratings.sweet; counts.sweet++; }
      if (r.ratings.sour)  { sums.sour += r.ratings.sour; counts.sour++; }
      if (r.ratings.bitter){ sums.bitter += r.ratings.bitter; counts.bitter++; }
    });

    const tasteHistory = {
      salty: { avgRating: counts.salty ? sums.salty / counts.salty : 3.0 },
      sweet: { avgRating: counts.sweet ? sums.sweet / counts.sweet : 3.0 },
      sour:  { avgRating: counts.sour ? sums.sour / counts.sour : 3.0 },
      bitter:{ avgRating: counts.bitter ? sums.bitter / counts.bitter : 3.0 }
    };

    // 3. Update the user's profile
    await connection.collection("users").updateOne(
      { id: userId },
      { $set: { tasteHistory } }
    );

    return { success: true, tasteHistory };
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
