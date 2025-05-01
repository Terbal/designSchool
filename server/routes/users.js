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
import db from "../db.js";

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

router.get("/cours/:coursId/utilisateurs", async (req, res) => {
  const { coursId } = req.params;

  try {
    const [formateur] = await db.query(
      `SELECT u.id, u.nom, u.role FROM cours c
       JOIN users u ON u.id = c.formateur_id
       WHERE c.id = ?`,
      [coursId]
    );

    const [etudiants] = await db.query(
      `SELECT u.id, u.nom, u.role
       FROM inscriptions i
       JOIN users u ON u.id = i.user_id
       WHERE i.cours_id = ?`,
      [coursId]
    );

    const users = [...formateur, ...etudiants];
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Lister les cours dont l’utilisateur est formateur ou étudiant
router.get("/:userId/cours", async (req, res) => {
  const { userId } = req.params;
  try {
    // 1) Cours où il est formateur
    const [asFormateur] = await db.query(
      `SELECT id, titre 
         FROM cours 
        WHERE formateur_id = ?`,
      [userId]
    );
    // 2) Cours où il est inscrit (table inscriptions)
    const [asEtudiant] = await db.query(
      `SELECT c.id, c.titre
         FROM inscription i
         JOIN cours c ON c.id = i.cours_id
        WHERE i.etudiant_id = ?`,
      [userId]
    );
    // On fusionne et on renvoie
    res.json([...asFormateur, ...asEtudiant]);
  } catch (err) {
    console.error("Erreur GET /api/users/:userId/cours", err);
    res.status(500).json({ error: "Erreur serveur lors du fetch des cours" });
  }
});

export default router;
