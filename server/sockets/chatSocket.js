// server/sockets/chatSocket.js
import db from "../db.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté au chat");

    // 1) Lorsqu'un client rejoint une conversation, on le place dans une "room"
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // 2) Lorsqu’un client émet "sendMessage"
    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, text } = data;
      try {
        // Enregistre en base
        const [result] = await db.query(
          "INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)",
          [conversationId, senderId, text]
        );
        const saved = {
          id: result.insertId,
          conversationId,
          senderId,
          text,
        };
        // Émet à tous les clients de la room
        io.to(conversationId).emit("newMessage", saved);
      } catch (err) {
        console.error("Erreur insertion message :", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Un utilisateur s’est déconnecté");
    });
  });
};

export default chatSocket;
