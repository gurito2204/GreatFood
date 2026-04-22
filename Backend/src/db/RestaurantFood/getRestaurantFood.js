const getDb = require("../db").getDb;
const getRestaurant = require("../Restaurant/getRestaurant");

module.exports = getRestaurantFood = async (id) => {
  try {
    const connection = await getDb();
    const response = await connection
      .collection("restaurantFood")
      .find({ RestaurantId: id })
      .toArray();
    const Restaurant = await getRestaurant(id);
    const foodItems = (response && response.length > 0 && response[0].food) ? response[0].food : [];
    
    const vegFood = foodItems.filter((item) => String(item.veg).toLowerCase().trim() === "true");
    const nonVegFood = foodItems.filter((item) => String(item.veg).toLowerCase().trim() !== "true");

    const combinedData = {
      ...Restaurant,
      veg: vegFood,
      nonveg: nonVegFood,
    };
    return combinedData;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
