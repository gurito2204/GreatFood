const getDb = require("../db").getDb;

/**
 * Cập nhật stock & available cho 1 food item.
 * Nếu stock === 0 → tự động set available = false.
 * stock = -1 nghĩa là "không giới hạn".
 */
module.exports = updateFoodStock = async (itemId, updates) => {
  try {
    const connection = await getDb();
    const setFields = {};

    if (updates.stock !== undefined) {
      setFields["food.$.stock"] = updates.stock;
      // Auto-disable khi stock = 0
      if (updates.stock === 0) {
        setFields["food.$.available"] = false;
      }
    }

    if (updates.available !== undefined) {
      setFields["food.$.available"] = updates.available;
    }

    // Cập nhật giá nhanh (nếu có)
    if (updates.price !== undefined) {
      setFields["food.$.price"] = updates.price;
    }

    const result = await connection
      .collection("restaurantFood")
      .updateOne(
        { "food.itemId": itemId },
        { $set: setFields }
      );

    return result.modifiedCount;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
