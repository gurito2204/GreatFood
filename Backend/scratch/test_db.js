const { mongoConnect } = require('../src/db/db');

mongoConnect(async () => {
  try {
    const { getDb } = require('../src/db/db');
    const db = getDb();
    const doc = await db.collection("restaurant").findOne({ Restaurant: "WE-R" });
    console.log(JSON.stringify(doc, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
