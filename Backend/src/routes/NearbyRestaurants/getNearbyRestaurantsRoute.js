const getNearbyRestaurants = require("../../db/NearbyRestaurants/getNearbyRestaurants");

module.exports = getNearbyRestaurantsRoute = {
  // GET /nearbyrestaurants?lat=10.87&lng=106.80&radius=50
  path: "/nearbyrestaurants",
  method: "get",
  handler: async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "lat và lng là bắt buộc" });
      }
      const response = await getNearbyRestaurants(lat, lng, radius ? parseFloat(radius) : 15);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json([]);
    }
  },
};
