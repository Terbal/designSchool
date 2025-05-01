import express from "express";
import db from "../db.js";

const router = express.Router();

// Récupérer tous les messages d'une conversation
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, sender AS senderId, text, time FROM messages WHERE conversation_id = ? ORDER BY time ASC",
      [conversationId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET /api/messages/:conversationId", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors du fetch des messages" });
  }
});

export default router;
