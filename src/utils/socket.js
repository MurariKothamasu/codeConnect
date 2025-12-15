const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://13.232.136.21", "http://codeconnects.in", "https://codeconnects.in"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinChat", ({userId , targetUserId}) => {

      const roomId = [userId , targetUserId].sort().join("_");
      socket.join(roomId)

    });
    

    socket.on("sendMessage", async ({firstName , lastName , userId , targetUserId , text}) => {
      // Save message to DB
      try {
        const roomId = [userId , targetUserId].sort().join("_");
        console.log(firstName + " " + text);
        
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();
        
        io.to(roomId).emit("messageReceived" , {firstName , lastName ,  text})
      } catch (err) {
        console.log(err);
      }
    });
    
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
