const getDb = require("../db").getDb;
const getRestaurant = require("../Restaurant/getRestaurant");

module.exports = getItemPriceCart = async (RestaurantId, itemId) => {
  try {
    const connection = await getDb();
    let newObj = {};
    const response = await connection
      .collection("restaurantFood")
      .findOne({ $or: [{ RestaurantId: RestaurantId }, { restaurantId: RestaurantId }] });
    
    if (!response || !response.food) {
      newObj[itemId] = { hotal: "Data not Found", name: "", price: "", image: "" };
      return newObj;
    }

    const matchingFoodItem = response.food.find((item) => item.itemId === itemId);
    const Restaurant = await getRestaurant(RestaurantId);
    
    if (!matchingFoodItem || !Restaurant) {
      newObj[itemId] = { hotal: "Data not Found", name: "", price: "", image: "" };
      return newObj;
    }

    newObj[itemId] = {
      hotal: Restaurant.Restaurant || "Nhà hàng",
      city: Restaurant.location || "Hồ Chí Minh",
      name: matchingFoodItem.name,
      price: matchingFoodItem.price,
      image: matchingFoodItem.image,
      stock: matchingFoodItem.stock ?? -1,
    };
    return newObj;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
