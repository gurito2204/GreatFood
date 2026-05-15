const { MongoClient } = require('mongodb');
require('dotenv').config();

async function getInfo() {
    const client = new MongoClient(process.env.MONGODB_URL);
    try {
        await client.connect();
        const db = client.db('admin');
        const status = await db.command({ replSetGetStatus: 1 });
        console.log("Replica Set Name:", status.set);
        await client.close();
    } catch (err) {
        console.error("Failed to get info:", err);
    }
}

getInfo();
