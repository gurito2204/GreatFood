const getDb = require("./db/db").getDb;

module.exports = function(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
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
