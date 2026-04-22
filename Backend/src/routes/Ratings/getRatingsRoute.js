const getRatings = require("../../db/Ratings/getRatings");

module.exports = getRatingsRoute = {
  path: "/restaurant/food/:itemId/rating",
  method: "get",
  handler: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const ratings = await getRatings(itemId);
      res.status(200).json({ success: true, data: ratings });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};
