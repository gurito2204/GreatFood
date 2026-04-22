const getDb = require("../db").getDb;

module.exports = getChatHistory = async (roomId) => {
  try {
    const connection = await getDb();
    const history = await connection
      .collection("chatHistory")
      .find({ roomId })
      .sort({ timestamp: 1 }) // oldest to newest
      .toArray();
    return history;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
