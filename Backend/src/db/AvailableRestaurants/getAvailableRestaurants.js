const getDb = require("../db").getDb;
const getRestaurant = require("../Restaurant/getRestaurant");

module.exports = getAvailableRestaurants = async (pincode) => {
  try {
    const connection = await getDb();
    const pipeline = [
      { $match: { pincode: String(pincode) } },
      {
        $project: {
          _id: 0,
          itemId: "",
          RestaurantId: { $ifNull: ["$RestaurantId", "$restaurantId"] },
          image: "$image",
          about: { heading: "$Restaurant", name: "$Restaurant_dish" },
          last: { star: "$rating", time: "$time", cost: "$price" },
          subscriptionTier: { $ifNull: ["$subscriptionTier", "BASIC"] },
          lat: { $ifNull: ["$lat", null] },
          lng: { $ifNull: ["$lng", null] },
          address: { $ifNull: ["$address", null] },
          isOpen: { $ifNull: ["$isOpen", true] }
        }
      },
      {
        $sort: {
          subscriptionTier: -1
        }
      }
    ];

    const AvailableRestaurants = await connection.collection("restaurant").aggregate(pipeline).toArray();
    return AvailableRestaurants;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
