const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    console.log("Testing connection to:", process.env.MONGODB_URL);
    const client = new MongoClient(process.env.MONGODB_URL);
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB");
        await client.close();
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

testConnection();
