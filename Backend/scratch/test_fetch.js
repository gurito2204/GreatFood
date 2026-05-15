const getAvailableRestaurants = require('../src/db/AvailableRestaurants/getAvailableRestaurants');
const getNearbyRestaurants = require('../src/db/NearbyRestaurants/getNearbyRestaurants');

async function test() {
  console.log("Testing getAvailableRestaurants with pincode 700017...");
  try {
    const avail = await getAvailableRestaurants("700017");
    console.log(`Found ${avail.length} restaurants for 700017`);
    console.log(avail.slice(0, 2));
  } catch (e) { console.error("Error avail:", e); }

  console.log("\nTesting getNearbyRestaurants with lat=10.87, lng=106.8...");
  try {
    const nearby = await getNearbyRestaurants(10.87, 106.8, 50);
    console.log(`Found ${nearby.length} restaurants nearby`);
    console.log(nearby.slice(0, 2));
  } catch (e) { console.error("Error nearby:", e); }
  
  process.exit(0);
}
test();
