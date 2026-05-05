const getDb = require("../../db/db").getDb;

module.exports = {
  method: "put",
  path: "/api/seller/restaurant/:restaurantId/toggle-open",
  handler: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const { isOpen } = req.body;

      if (typeof isOpen !== "boolean") {
        return res.status(400).json({ message: "isOpen phải là true hoặc false" });
      }

      const connection = await getDb();
      const result = await connection.collection("restaurant").updateOne(
        { RestaurantId: restaurantId },
        { $set: { isOpen } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Không tìm thấy quán" });
      }

      return res.status(200).json({
        message: isOpen ? "Quán đã mở cửa" : "Quán đã đóng cửa",
        isOpen,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message || "Lỗi server" });
    }
  },
};
