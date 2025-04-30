// server/sockets/chatSocket.js
import db from "../db.js";

const chatSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Un utilisateur est connecté au chat");

    // 1. Envoyer les anciens messages à l'utilisateur connecté
    try {
      const [rows] = await db.query("SELECT * FROM messages ORDER BY time ASC");
      rows.forEach((msg) => socket.emit("message", msg));
    } catch (err) {
      console.error("Erreur récupération messages :", err);
    }

    // 2. Lorsqu’un utilisateur envoie un message
    socket.on("message", async (data) => {
      const { sender, text, time } = data;

      try {
        await db.query(
          "INSERT INTO messages (sender, text, time) VALUES (?, ?, ?)",
          [sender, text, time]
        );
        io.emit("message", data); // renvoyer à tous
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
