const { mongoConnect } = require('../src/db/db');
const getRestaurantFood = require('../src/db/RestaurantFood/getRestaurantFood');
const getRestaurantOffers = require('../src/db/RestaurantOffers/getRestaurantOffers');

mongoConnect(async () => {
  try {
    const id = "2c555274-25f7-47c7-8992-ac3ae3d2a457";
    const response = await getRestaurantFood(id);
    const offers = await getRestaurantOffers(id);
    const newResponse = { ...response, offers: offers };
    console.log("Success! Keys:", Object.keys(newResponse));
  } catch (err) {
    console.error("Error thrown:", err);
  }
  process.exit(0);
});
