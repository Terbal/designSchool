// server/controllers/conversationsController.js
import db from "../db.js";

// Créer une conversation (private, group, course)
export const createConversation = async (req, res) => {
  const { type, name, participants } = req.body;
  if (!type || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: "Type et participants requis." });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO conversations (type, name) VALUES (?, ?)",
      [type, name || null]
    );
    const convId = result.insertId;
    // Insérer participants
    const values = participants.map((userId) => [convId, userId]);
    await db.query(
      "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?",
      [values]
    );
    res.status(201).json({ id: convId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Lister conversations pour l'admin ou un user
export const getConversations = async (req, res) => {
  try {
    // Si admin, on récupère tout
    if (req.user.role === "admin") {
      const [rows] = await db.query(
        "SELECT * FROM conversations ORDER BY created_at DESC"
      );
      return res.json(rows);
    }
    // Sinon, fetch où il participe
    const [rows] = await db.query(
      `SELECT c.* FROM conversations c
       JOIN conversation_participants p ON p.conversation_id = c.id
       WHERE p.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Envoyer un message
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message vide" });
  try {
    const sender = req.user.nom;
    const [result] = await db.query(
      "INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)",
      [conversationId, sender, text]
    );
    res
      .status(201)
      .json({ id: result.insertId, sender, text, time: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer les messages d'une conversation
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY time ASC",
      [conversationId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
