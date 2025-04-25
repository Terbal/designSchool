import express from "express";
import { registerUser, loginUser } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// ✅ Route protégée (accès seulement avec token valide)
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

export default router;
