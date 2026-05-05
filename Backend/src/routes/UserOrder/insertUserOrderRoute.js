const insertUserOrder = require("../../db/UserOrder/insertUserOrder");
const { emitNewOrder } = require("../../chatHandler");

module.exports = insertUserOrderRoute = {
  path: "/userorder/:userid",
  method: "post",
  handler: async (req, res) => {
    try {
      const userid = req.params.userid;
      const order = req.body;
      const orderId = await insertUserOrder(userid, order);

      // Emit real-time notification to seller
      if (order.restaurantId) {
        emitNewOrder(order.restaurantId, {
          orderId,
          restaurantId: order.restaurantId,
          createdAt: new Date(),
          itemCount: (order.order || []).length,
        });
      }

      return res.status(200).send({
        message: "Food Ordered successfully!",
        response: orderId,
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message || "Food Ordered Failed!",
        response: "",
      });
    }
  },
};
