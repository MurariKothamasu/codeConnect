const socket = require("socket.io");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://13.232.136.21"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinChat", ({userId , targetUserId}) => {

      const roomId = [userId , targetUserId].sort().join("_");
      socket.join(roomId)

    });
    

    socket.on("sendMessage", ({firstName , lastName , userId , targetUserId , text}) => {
      const roomId = [userId , targetUserId].sort().join("_");
      io.to(roomId).emit("messageReceived" , {firstName , lastName ,  text})
    });
    
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
