const getDb = require("../db").getDb;
const getRestaurant = require("../Restaurant/getRestaurant");

module.exports = getAvailableRestaurants = async (pincode) => {
  try {
    const connection = await getDb();
    const response = await connection
      .collection("restaurantFood")
      .find()
      .toArray();
    var AvailableRestaurants = [];
    await Promise.all(
      response.map(async (restaurant, index) => {
        const Restaurant = await getRestaurant(restaurant.RestaurantId);
        if (Restaurant.pincode == pincode) {
          var temp = {
            itemId: "",
            RestaurantId: "",
            image: "",
            about: { heading: "", name: "" },
            last: { star: "", time: "", cost: "" },
            subscriptionTier: Restaurant.subscriptionTier || 'BASIC'
          };
          temp.about.heading = Restaurant.Restaurant;
          temp.RestaurantId = restaurant.RestaurantId;
          temp.image = Restaurant.image; // Use the restaurant's uploaded image
          temp.about.name = Restaurant.Restaurant_dish; 
          temp.last.star = Restaurant.rating;
          temp.last.time = Restaurant.time;
          temp.last.cost = Restaurant.price;
          AvailableRestaurants.push(temp);
        }
      })
    );
    
    // Sort so PREMIUM restaurants appear first
    AvailableRestaurants.sort((a, b) => {
      if (a.subscriptionTier === 'PREMIUM' && b.subscriptionTier !== 'PREMIUM') return -1;
      if (a.subscriptionTier !== 'PREMIUM' && b.subscriptionTier === 'PREMIUM') return 1;
      return 0;
    });

    return AvailableRestaurants;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
