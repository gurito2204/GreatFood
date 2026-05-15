const updateOrderStatus = require("../../db/UserOrder/updateOrderStatus");
const { emitOrderStatusChanged, emitOrderStatusChangedToSeller } = require("../../chatHandler");

module.exports = updateOrderStatusRoute = {
  path: "/api/seller/orders/:orderId/status",
  method: "put",
  handler: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "status là bắt buộc" });
      }
      const result = await updateOrderStatus(orderId, status);

      // Thông báo buyer qua socket
      if (result.userId) {
        emitOrderStatusChanged(result.userId, {
          orderId,
          newStatus: status,
          updatedAt: new Date(),
        });
      }

      // Thông báo seller (để đồng bộ nhiều thiết bị nếu có)
      if (result.restaurantId) {
        emitOrderStatusChangedToSeller(result.restaurantId, {
          orderId,
          newStatus: status,
          updatedAt: new Date(),
        });
      }

      return res.status(200).json({ message: "Cập nhật trạng thái thành công", result });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Cập nhật thất bại" });
    }
  },
};
