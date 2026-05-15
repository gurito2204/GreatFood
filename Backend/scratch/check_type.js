const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://abc:123@clustertmdt.cckp5yy.mongodb.net/mymongoDB?appName=ClusterTMDT";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("mymongoDB");
  const r = await db.collection('restaurant').findOne({ Restaurant: "Thịt nguội ngô gia" });
  console.log("Restaurant:", r);
  console.log("RestaurantId type:", typeof r.RestaurantId);
  await client.close();
}
run().catch(console.dir);
