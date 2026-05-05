const getDb = require("../db").getDb;

/**
 * Lấy tất cả đơn hàng của 1 restaurant, sort mới nhất lên đầu.
 */
module.exports = getSellerOrders = async (restaurantId) => {
  try {
    const connection = await getDb();
    const orders = await connection
      .collection("orders")
      .find({ restaurantId })
      .sort({ createdAt: -1 })
      .toArray();
    return orders;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
