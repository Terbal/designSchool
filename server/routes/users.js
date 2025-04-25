import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getAllUsers,
  deleteUser,
} from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// 👇 route GET profil
router.get("/:id", verifyToken, getUserProfile);

// 👇 route PUT profil
router.put("/:id", verifyToken, updateUserProfile);

router.put("/update-password", verifyToken, updatePassword);

router.get("/admin/users", verifyToken, getAllUsers);

router.delete("/admin/users/:id", verifyToken, deleteUser);

// ✅ Route protégée (accès seulement avec token valide)
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

export default router;
