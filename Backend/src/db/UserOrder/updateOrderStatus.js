const getDb = require("../db").getDb;

/**
 * Cập nhật trạng thái đơn hàng.
 * Luồng hợp lệ: pending → confirmed → completed
 *                pending → cancelled
 *                confirmed → cancelled
 */
const VALID_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
};

module.exports = updateOrderStatus = async (orderId, newStatus) => {
  try {
    const connection = await getDb();
    const order = await connection.collection("orders").findOne({ orderId });
    if (!order) throw new Error("Order not found");

    const currentStatus = order.status || "pending";
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Không thể chuyển từ "${currentStatus}" sang "${newStatus}"`);
    }

    const result = await connection.collection("orders").updateOne(
      { orderId },
      { 
        $set: { 
          status: newStatus, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
