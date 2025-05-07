// server/routes/statsRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  getUserStats,
  getMessageStats,
  getCourseStats,
} from "../controllers/statsController.js";

const router = express.Router();

// Protéger toutes ces routes: admin only
router.use(verifyToken, checkRole("admin"));

// GET /api/admin/stats/users
router.get("/users", getUserStats);

// GET /api/admin/stats/messages?period=daily|weekly|monthly|yearly
router.get("/messages", getMessageStats);

// GET /api/admin/stats/courses
router.get("/courses", getCourseStats);

export default router;
