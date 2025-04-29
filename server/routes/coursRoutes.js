// server/routes/coursRoutes.js
import express from "express";
import db from "../db.js"; // ou le chemin correct vers ta connexion database

import {
  createCours,
  deleteCours,
  getAllCours,
  updateCours,
} from "../controllers/coursController.js";
import { checkRole } from "../middleware/roleMiddleware.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Seuls admin ET formateur peuvent créer un cours
router.post("/", verifyToken, checkRole("admin", "formateur"), createCours);

// Tout le monde peut voir les cours
router.get("/", getAllCours);

// Seul l'admin peut supprimer un cours
router.delete("/:id", verifyToken, checkRole("admin"), deleteCours);

// Seuls admin ET formateur peuvent modifier un cours
router.put("/:id", verifyToken, checkRole("admin", "formateur"), updateCours);

// Récupérer les détails d'un cours
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cours WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Cours non trouvé" });

    const cours = rows[0];

    const [creneaux] = await db.query(
      "SELECT * FROM creneaux WHERE cours_id = ?",
      [cours.id]
    );
    cours.creneaux = creneaux;

    res.json(cours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Création d'un cours
router.post("/", async (req, res) => {
  const { titre, description, formateur_id } = req.body;
  if (!titre || !description || !formateur_id) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO cours (titre, description, formateur_id) VALUES (?, ?, ?)",
      [titre, description, formateur_id]
    );
    res
      .status(201)
      .json({ id: result.insertId, titre, description, formateur_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du cours." });
  }
});

export default router;
