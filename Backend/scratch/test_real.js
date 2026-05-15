const { mongoConnect } = require('../src/db/db');
const getNearbyRestaurants = require('../src/db/NearbyRestaurants/getNearbyRestaurants');

mongoConnect(async () => {
  try {
    const res = await getNearbyRestaurants(10.87, 106.8, 50);
    res.forEach(r => {
      if (r.about.heading === 'Vạn Dân Đường') {
        console.log(JSON.stringify(r, null, 2));
      }
    });
  } catch (err) {}
  process.exit(0);
});
