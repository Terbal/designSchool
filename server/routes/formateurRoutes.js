// routes/formateurRoutes.js
import express from "express";
import {
  createCreneau,
  createModule,
  getFormateurs,
  getMesModules,
} from "../controllers/formateurController.js";
import { getEtudiantsParModule } from "../controllers/coursController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFormateurs);

router.get("/mes-modules", verifyToken, getMesModules);
router.get("/modules/:id/etudiants", verifyToken, getEtudiantsParModule);

router.post("/modules", verifyToken, createModule);

router.post("/modules/:id/creneaux", verifyToken, createCreneau);

export default router;
