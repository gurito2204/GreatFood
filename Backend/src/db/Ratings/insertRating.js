const getDb = require("../db").getDb;

const FLAVORS = ["salty", "sweet", "sour", "bitter", "spicy"];

module.exports = insertRating = async (userId, itemId, ratings) => {
  try {
    const connection = await getDb();

    // 1. Insert/Update the rating in foodRatings collection
    await connection.collection("foodRatings").updateOne(
      { userId, itemId },
      { $set: { ratings, updatedAt: new Date() } },
      { upsert: true }
    );

    // 2. Recalculate flavorAvg for this food item (global average of all users' ratings)
    const allItemRatings = await connection.collection("foodRatings").find({ itemId }).toArray();
    const flavorAvg = {};
    for (const flavor of FLAVORS) {
      const values = allItemRatings
        .filter(r => r.ratings[flavor] != null)
        .map(r => r.ratings[flavor]);
      flavorAvg[flavor] = values.length > 0
        ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
        : 5.0; // Default center of 1-10 scale
    }

    // Update flavorAvg on the food item in restaurantFood collection
    await connection.collection("restaurantFood").updateMany(
      { "items.itemId": itemId },
      { $set: { [`items.$.flavorAvg`]: flavorAvg } }
    );

    // 3. Recalculate user's taste bias B_u = avg(R_u,i - S̄_i) for each flavor
    const userRatings = await connection.collection("foodRatings").find({ userId }).toArray();

    const deviations = {};
    for (const flavor of FLAVORS) {
      deviations[flavor] = [];
    }

    for (const r of userRatings) {
      // Look up global average for this food item
      const itemRatings = await connection.collection("foodRatings").find({ itemId: r.itemId }).toArray();
      const globalAvg = {};
      for (const flavor of FLAVORS) {
        const vals = itemRatings.filter(ir => ir.ratings[flavor] != null).map(ir => ir.ratings[flavor]);
        globalAvg[flavor] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 5.0;
      }

      for (const flavor of FLAVORS) {
        if (r.ratings[flavor] != null) {
          deviations[flavor].push(r.ratings[flavor] - globalAvg[flavor]);
        }
      }
    }

    // B_u per flavor
    const tasteHistory = {};
    for (const flavor of FLAVORS) {
      const arr = deviations[flavor];
      tasteHistory[flavor] = {
        bias: arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100 : 0,
        count: arr.length,
      };
    }

    // 4. Update the user's profile with taste bias
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
