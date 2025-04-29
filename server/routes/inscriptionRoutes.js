import express from "express";
import {
  inscrireAuCours,
  getMesCours,
  inscrireEtudiant,
} from "../controllers/inscriptionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/inscription/cours/:id/inscrire
router.post("/cours/:id/inscrire", verifyToken, inscrireAuCours);

// GET /api/inscription/mes-cours
router.get("/mes-cours", verifyToken, getMesCours);

router.post("/", verifyToken, inscrireEtudiant);

export default router;
