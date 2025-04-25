// routes/admin.js (à créer si besoin)
import express from "express";
import {
  getAllUsers,
  getAllUsersDelete,
} from "../controllers/usersController.js"; // ou autre nom selon ton projet
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route accessible uniquement aux admins
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, getAllUsersDelete);

export default router;
