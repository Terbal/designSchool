// routes/formateurRoutes.js
import express from "express";
import {
  getFormateurs,
  getMesModules,
} from "../controllers/formateurController.js";
import { getEtudiantsParModule } from "../controllers/coursController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFormateurs);

router.get("/mes-modules", verifyToken, getMesModules);
router.get("/modules/:id/etudiants", verifyToken, getEtudiantsParModule);

export default router;
