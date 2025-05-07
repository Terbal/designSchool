// server/routes/conversationsRoutes.js
import express from "express";
import {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
} from "../controllers/conversationsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Créer une conversation (admin seulement)
router.post("/", verifyToken, checkRole("admin"), createConversation);

// Lister conversations (admin ou participants)
router.get("/", verifyToken, getConversations);

// Get messages
router.get("/:conversationId/messages", verifyToken, getMessages);

// Send message
router.post("/:conversationId/messages", verifyToken, sendMessage);

export default router;
