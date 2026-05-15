const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://abc:123@clustertmdt.cckp5yy.mongodb.net/mymongoDB?appName=ClusterTMDT";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("mymongoDB");
  const restaurants = await db.collection('restaurant').find().toArray();
  console.log("Restaurants count:", restaurants.length);
  for (const r of restaurants) {
    console.log(`- ${r.Restaurant} | ID: ${r.RestaurantId} | Pincode: ${r.pincode}`);
  }
  await client.close();
}
run().catch(console.dir);
