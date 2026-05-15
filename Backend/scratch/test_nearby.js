const { MongoClient } = require('mongodb');

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

async function run() {
  const uri = "mongodb+srv://abc:123@clustertmdt.cckp5yy.mongodb.net/mymongoDB?appName=ClusterTMDT";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("mymongoDB");
  
  // mock lat lng
  const userLat = 10.87;
  const userLng = 106.80;
  const radiusKm = 50;
  
  const restaurants = await db.collection("restaurant").find().toArray();
  const results = [];
  
  console.log(`Checking ${restaurants.length} restaurants...`);
  
  for (const restaurant of restaurants) {
    const rId = restaurant.RestaurantId || restaurant.restaurantId;
    if (!rId) {
      console.log(`Skip (no ID): ${restaurant.Restaurant}`);
      continue;
    }

    const temp = {
      RestaurantId: rId,
      image: restaurant.image,
      about: {
        heading: restaurant.Restaurant,
        name: restaurant.Restaurant_dish,
      },
      last: {
        star: restaurant.rating,
        time: restaurant.time,
        cost: restaurant.price,
      },
      subscriptionTier: restaurant.subscriptionTier || "BASIC",
      distanceKm: null,
      lat: restaurant.lat || null,
      lng: restaurant.lng || null,
      address: restaurant.address || null,
      isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
    };

    // Bỏ qua các nhà hàng không có tọa độ
    if (restaurant.lat == null || restaurant.lng == null) {
      console.log(`Skip (no coords): ${restaurant.Restaurant}`);
      continue;
    }

    const d = haversineKm(
      parseFloat(userLat),
      parseFloat(userLng),
      parseFloat(restaurant.lat),
      parseFloat(restaurant.lng)
    );

    if (isNaN(d)) {
      console.log(`Skip (NaN distance): ${restaurant.Restaurant}`);
      continue;
    }

    temp.distanceKm = parseFloat(d.toFixed(1));
    
    // Lọc theo bán kính
    if (temp.distanceKm > radiusKm) {
      console.log(`Skip (too far - ${temp.distanceKm}km): ${restaurant.Restaurant}`);
      continue;
    }

    results.push(temp);
  }
  
  console.log("Returned:", results.length);
  results.forEach(r => console.log(`- ${r.about.heading} (${r.distanceKm}km)`));
  
  await client.close();
}
run().catch(console.dir);
