const getSellerOrders = require("../../db/UserOrder/getSellerOrders");

module.exports = getSellerOrdersRoute = {
  path: "/api/seller/orders/:restaurantId",
  method: "get",
  handler: async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const orders = await getSellerOrders(restaurantId);
      return res.status(200).json({ orders });
    } catch (err) {
      return res.status(400).json({ message: "Failed to fetch seller orders", orders: [] });
    }
  },
};
