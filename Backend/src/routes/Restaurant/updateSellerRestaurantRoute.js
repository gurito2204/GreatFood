const updateRestaurant = require("../../db/Restaurant/updateRestaurant");

module.exports = {
  method: "put",
  path: "/api/seller/restaurant/:restaurantId",
  handler: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const updates = req.body;
      
      const result = await updateRestaurant(restaurantId, updates);
      res.status(200).json({
        message: "Cập nhật thông tin quán thành công",
        result,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message || "Cập nhật thất bại",
      });
    }
  },
};
