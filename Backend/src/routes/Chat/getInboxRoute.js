const getDb = require("../../db/db").getDb;

module.exports = {
  method: "get",
  path: "/api/seller/inbox/:restaurantId",
  handler: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const connection = await getDb();
      
      // Find all messages belonging to this restaurant's rooms
      const messages = await connection.collection("chatHistory")
        .find({ roomId: { $regex: restaurantId } })
        .sort({ timestamp: -1 })
        .toArray();
        
      const rooms = {};
      let totalUnread = 0;
      
      messages.forEach(msg => {
        if (!rooms[msg.roomId]) {
          const parts = msg.roomId.split("_");
          // Extract buyerId from roomId format [buyerId]_[restaurantId]
          const buyerId = parts[0] === restaurantId ? parts[1] : parts[0];
          
          rooms[msg.roomId] = {
            roomId: msg.roomId,
            buyerId: buyerId,
            lastMessage: msg.text,
            lastMessageTime: msg.timestamp,
            unreadCount: 0,
            buyerName: "Khách hàng" // Fallback name
          };
        }
        
        // If message was sent by buyer and is not read, increment unread
        if (msg.senderId !== restaurantId && msg.isRead === false) {
          rooms[msg.roomId].unreadCount++;
          totalUnread++;
        }
      });
      
      // Fetch user details for each buyer
      const roomList = Object.values(rooms);
      for (let room of roomList) {
        const user = await connection.collection("users").findOne({ _id: room.buyerId });
        if (user && user.name) {
          room.buyerName = user.name;
        }
      }
      
      res.status(200).json({ conversations: roomList, totalUnread });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
