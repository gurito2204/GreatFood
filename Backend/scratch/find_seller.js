const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'd:/Đồ_án_TMDT/Map-My-Food/backend/.env' });

async function findSeller() {
    const client = new MongoClient(process.env.MONGODB_URL);
    try {
        await client.connect();
        const db = client.db();
        const user = await db.collection('users').findOne({ restaurantId: { $exists: true } });
        console.log(JSON.stringify(user, null, 2));
    } finally {
        await client.close();
    }
}

findSeller();
