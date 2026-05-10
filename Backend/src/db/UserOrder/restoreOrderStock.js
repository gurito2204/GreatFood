const getDb = require("../db").getDb;

/**
 * Hoàn lại stock cho các item trong đơn hàng khi đơn bị hủy.
 * Chỉ hoàn nếu item có stock > 0 (stock = -1 là không giới hạn, không cần hoàn).
 */
module.exports = restoreOrderStock = async (order) => {
  try {
    const connection = await getDb();
    const items = order.order || [];

    for (const item of items) {
      if (!item.itemId) continue;
      const qty = item.quantity || 1;

      const foodDoc = await connection.collection("restaurantFood").findOne({ "food.itemId": item.itemId });
      if (!foodDoc) continue;

      const foodItem = foodDoc.food.find(f => f.itemId === item.itemId);
      if (!foodItem) continue;

      const currentStock = foodItem.stock ?? -1;
      // Chỉ hoàn nếu stock được theo dõi (không phải unlimited)
      if (currentStock >= 0) {
        const newStock = currentStock + qty;
        await connection.collection("restaurantFood").updateOne(
          { "food.itemId": item.itemId },
          { $set: { "food.$.stock": newStock, "food.$.available": true } }
        );
      }
    }
  } catch (err) {
    console.log("restoreOrderStock error:", err.message);
    // Không throw – hoàn stock là best-effort, không nên block cancel flow
  }
};
