import express from "express";
import {
  inscrireAuCours,
  getMesCours,
  inscrireEtudiant,
} from "../controllers/inscriptionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route POST pour s'inscrire à un module
router.post("/", verifyToken, inscrireEtudiant);

// Route pour inscrire un utilisateur à un cours
router.post("/cours/:coursId/inscrire", verifyToken, inscrireAuCours);

router.get("/mes-cours", verifyToken, getMesCours);

export default router;
