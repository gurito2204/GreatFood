const getDb = require("../db").getDb;
const updateUserRestaurantId = require("../Auth/updateUserRestaurantId");
module.exports = insertRestaurant = async (userId, Restaurant) => {
  try {
    const connection = await getDb();
    const { insertedId } = await connection.collection("restaurant").insertOne({
      ...Restaurant,
    });
    const response = await updateUserRestaurantId(
      userId,
      Restaurant.restaurantId
    );
    return {
      data: response,
      message: "User Data Updated Sucessfully!",
      navigate: "true",
      token: response.token,
    };
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
