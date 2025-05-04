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

    // Modifiez la partie d'émission des messages
    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, text } = data;
      try {
        // Insertion du message
        const [insertResult] = await db.query(
          "INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)",
          [conversationId, senderId, text]
        );

        // Récupération du message complet
        const [messages] = await db.query(
          "SELECT *, time AS createdAt FROM messages WHERE id = ?",
          [insertResult.insertId]
        );

        // Émission du message formaté
        const savedMessage = {
          id: messages[0].id,
          conversationId: messages[0].conversation_id,
          senderId: messages[0].sender,
          text: messages[0].text,
          createdAt: messages[0].createdAt, // Utilisation de l'alias
        };

        io.to(conversationId).emit("newMessage", savedMessage);
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
