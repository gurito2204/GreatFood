const getDb = require("../../db/db").getDb;
const restoreOrderStock = require("../../db/UserOrder/restoreOrderStock");

module.exports = cancelBuyerOrderRoute = {
  path: "/api/buyer/orders/:orderId/cancel",
  method: "put",
  handler: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId là bắt buộc" });
      }

      const connection = await getDb();
      const order = await connection.collection("orders").findOne({ orderId });

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      // Verify ownership: chỉ người đặt mới được hủy
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Bạn không có quyền hủy đơn này" });
      }

      // Chỉ cho phép hủy khi đang pending
      if ((order.status || "pending") !== "pending") {
        return res.status(400).json({ 
          message: "Chỉ có thể hủy đơn đang chờ xác nhận" 
        });
      }

      // Update status
      await connection.collection("orders").updateOne(
        { orderId },
        { $set: { status: "cancelled", cancelledBy: "buyer", updatedAt: new Date() } }
      );

      // Hoàn lại stock (best-effort)
      await restoreOrderStock(order);

      return res.status(200).json({ message: "Đã hủy đơn hàng thành công" });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Hủy đơn thất bại" });
    }
  },
};
