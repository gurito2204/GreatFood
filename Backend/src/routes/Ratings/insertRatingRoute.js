const insertRating = require("../../db/Ratings/insertRating");

module.exports = insertRatingRoute = {
  path: "/restaurant/food/:itemId/rating",
  method: "post",
  handler: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const { userId, ratings } = req.body;
      
      if (!userId || !ratings) {
        return res.status(400).json({ success: false, message: "Missing userId or ratings" });
      }

      const result = await insertRating(userId, itemId, ratings);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};
