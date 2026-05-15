const getDb = require('../src/db').getDb;

async function check() {
  const db = await getDb();
  const rest = await db.collection("restaurant").findOne({});
  console.log("Restaurant doc keys:", Object.keys(rest));
  process.exit(0);
}
check();
