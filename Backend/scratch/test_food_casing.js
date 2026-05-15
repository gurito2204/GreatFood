const { mongoConnect } = require('../src/db/db');

mongoConnect(async () => {
  try {
    const { getDb } = require('../src/db/db');
    const db = getDb();
    const id = "2c555274-25f7-47c7-8992-ac3ae3d2a457";
    const doc = await db.collection("restaurantFood").findOne({ $or: [{ RestaurantId: id }, { restaurantId: id }] });
    console.log(JSON.stringify(doc, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
