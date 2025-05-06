import express from "express";
import db from "../db.js";

const router = express.Router();

// Créer une nouvelle conversation
router.post("/new", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    const [existing] = await db.query(
      `SELECT c.id FROM conversations c
       JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
       JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = ?
       GROUP BY c.id`,
      [user1_id, user2_id]
    );

    if (existing.length > 0) {
      return res.json({ conversationId: existing[0].id });
    }

    const [result] = await db.query("INSERT INTO conversations () VALUES ()");
    const conversationId = result.insertId;

    await db.query(
      `INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)`,
      [conversationId, user1_id, conversationId, user2_id]
    );

    res.status(201).json({ conversationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Obtenir les conversations d'un utilisateur
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.id AS conversationId, u.nom AS otherName, u.id AS otherId
         FROM conversations c
         JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
         JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != ?
         JOIN users u ON u.id = cp2.user_id`,
      [userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Ajouter un message à une conversation
router.post("/message", async (req, res) => {
  const { conversation_id, sender, text } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)`,
      [conversation_id, sender, text]
    );

    res
      .status(201)
      .json({ id: result.insertId, conversation_id, sender, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM conversations");
  res.json(rows);
});

export default router;
