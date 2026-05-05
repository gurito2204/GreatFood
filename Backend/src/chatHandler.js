const getDb = require("./db/db").getDb;

let ioInstance = null;

module.exports = function(io) {
  ioInstance = io;
  
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Seller joins their notification room
    socket.on("join_seller_room", (restaurantId) => {
      const sellerRoom = `seller_${restaurantId}`;
      socket.join(sellerRoom);
      console.log(`Seller ${socket.id} joined seller room: ${sellerRoom}`);
    });

    socket.on("send_message", async (data) => {
      // data expected: { roomId, senderId, text, timestamp }
      try {
        const connection = await getDb();
        data.isRead = false;
        await connection.collection("chatHistory").insertOne(data);
        
        io.to(data.roomId).emit("receive_message", data);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Export function to emit new_order to seller room
module.exports.emitNewOrder = (restaurantId, orderData) => {
  if (ioInstance) {
    const sellerRoom = `seller_${restaurantId}`;
    ioInstance.to(sellerRoom).emit("new_order", orderData);
  }
};
