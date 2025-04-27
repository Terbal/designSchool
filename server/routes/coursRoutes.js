// server/routes/coursRoutes.js
import express from "express";
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

router.post("/", verifyToken, createCours);
router.get("/", getAllCours);
router.delete("/:id", verifyToken, deleteCours);
router.put("/:id", verifyToken, updateCours);

export default router;
