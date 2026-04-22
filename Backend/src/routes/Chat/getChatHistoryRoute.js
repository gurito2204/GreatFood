const getChatHistory = require("../../db/Chat/getChatHistory");

module.exports = getChatHistoryRoute = {
  path: "/chat/:roomId",
  method: "get",
  handler: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const history = await getChatHistory(roomId);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};
