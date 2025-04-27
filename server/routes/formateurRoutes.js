// routes/formateurRoutes.js
import express from "express";
import { getFormateurs } from "../controllers/formateurController.js";

const router = express.Router();

router.get("/", getFormateurs);

export default router;
