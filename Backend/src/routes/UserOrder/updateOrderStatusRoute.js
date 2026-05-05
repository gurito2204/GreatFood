const updateOrderStatus = require("../../db/UserOrder/updateOrderStatus");

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
      return res.status(200).json({ message: "Cập nhật trạng thái thành công", result });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Cập nhật thất bại" });
    }
  },
};
