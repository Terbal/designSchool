// server/routes/adminUsersRoute.js
import express from "express";
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
  getUserCourses,
} from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET    /api/admin/users       → lister tous les users (admin only)
router.get("/", verifyToken, checkRole("admin"), getAllUsers);

// POST   /api/admin/users       → créer un user (admin only)
router.post("/", verifyToken, checkRole("admin"), registerUser);

// PUT    /api/admin/users/:id   → mettre à jour (admin only)
router.put("/:id", verifyToken, checkRole("admin"), updateUser);

// DELETE /api/admin/users/:id   → supprimer (admin only)
router.delete("/:id", verifyToken, checkRole("admin"), deleteUser);

router.get("/:userId/cours", verifyToken, checkRole("admin"), getUserCourses);

export default router;
