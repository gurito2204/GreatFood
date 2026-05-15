const getDb = require("../../db/db").getDb;

module.exports = completeBuyerOrderRoute = {
  path: "/api/buyer/orders/:orderId/complete",
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

      // Verify ownership: chỉ người đặt mới được xác nhận
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Bạn không có quyền thao tác trên đơn này" });
      }

      // Chỉ cho phép xác nhận khi đã "confirmed"
      if (order.status !== "confirmed") {
        return res.status(400).json({ 
          message: "Chỉ có thể xác nhận nhận hàng đối với đơn đang giao (Đã xác nhận)" 
        });
      }

      // Update status
      await connection.collection("orders").updateOne(
        { orderId },
        { $set: { status: "completed", completedBy: "buyer", updatedAt: new Date() } }
      );

      // Thông báo cho seller
      if (order.restaurantId) {
        const { emitOrderStatusChangedToSeller } = require("../../chatHandler");
        emitOrderStatusChangedToSeller(order.restaurantId, {
          orderId,
          newStatus: "completed",
          updatedAt: new Date(),
        });
      }

      return res.status(200).json({ message: "Đã xác nhận nhận hàng thành công" });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Xác nhận thất bại" });
    }
  },
};
