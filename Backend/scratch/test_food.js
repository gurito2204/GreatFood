const { mongoConnect } = require('../src/db/db');
const getRestaurantFood = require('../src/db/RestaurantFood/getRestaurantFood');

mongoConnect(async () => {
  try {
    const id = "2c555274-25f7-47c7-8992-ac3ae3d2a457";
    const res = await getRestaurantFood(id);
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
