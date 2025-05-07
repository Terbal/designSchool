// routes/actualitesRoutes.js
import express from "express";
import {
  getAllActualites,
  createActualite,
  updateActualite,
  deleteActualite,
} from "../controllers/actualitesController.js";

const router = express.Router();

router.get("/", getAllActualites);
router.post("/", createActualite);
router.put("/:id", updateActualite);
router.delete("/:id", deleteActualite);

export default router;
