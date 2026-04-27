const getAvailableRestaurantsSorting = require("../../db/AvailableRestaurantsSorting/getAvailableRestaurantsSorting");

module.exports = getAvailableRestaurantsSortingRoute = {
  path: "/availablerestaurants/:pincode/:sorting",
  method: "get",
  handler: async (req, res) => {
    try {
      const pincode = req.params.pincode;
      const sorting = req.params.sorting;
      // lat/lng query params: /availablerestaurants/:pincode/nearest?lat=10.87&lng=106.80
      const userLat = req.query.lat ?? null;
      const userLng = req.query.lng ?? null;
      const response = await getAvailableRestaurantsSorting(pincode, sorting, userLat, userLng);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json([]);
    }
  },
};
