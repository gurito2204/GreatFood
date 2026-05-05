const updateFoodStock = require("../../db/RestaurantFood/updateFoodStock");

module.exports = updateFoodStockRoute = {
  path: "/api/food/:itemId/stock",
  method: "put",
  handler: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const { stock, available, price } = req.body;
      const result = await updateFoodStock(itemId, { stock, available, price });
      return res.status(200).json({ message: "Cập nhật kho thành công", result });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Cập nhật thất bại" });
    }
  },
};
