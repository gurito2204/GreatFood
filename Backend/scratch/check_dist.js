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
  const restaurants = await db.collection('restaurant').find().toArray();
  const userLat = 10.87;
  const userLng = 106.80;
  console.log(`User at ${userLat}, ${userLng}`);
  for (const r of restaurants) {
    if (r.lat && r.lng) {
      const d = haversineKm(userLat, userLng, parseFloat(r.lat), parseFloat(r.lng));
      console.log(`- ${r.Restaurant} | ID: ${r.RestaurantId} | lat: ${r.lat}, lng: ${r.lng} | Dist: ${d.toFixed(1)} km`);
    } else {
      console.log(`- ${r.Restaurant} | ID: ${r.RestaurantId} | No coords`);
    }
  }
  await client.close();
}
run().catch(console.dir);
