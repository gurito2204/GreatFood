const getDb = require("../../db/db").getDb;

module.exports = {
  method: "put",
  path: "/api/chat/read/:roomId",
  handler: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { restaurantId } = req.body; // the one reading it
      const connection = await getDb();
      
      // Update all messages in this room that were NOT sent by the restaurant to isRead: true
      await connection.collection("chatHistory").updateMany(
        { roomId: roomId, senderId: { $ne: restaurantId }, isRead: false },
        { $set: { isRead: true } }
      );
      
      res.status(200).json({ message: "Messages marked as read" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
