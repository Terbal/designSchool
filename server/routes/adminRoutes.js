// routes/admin.js
import express from "express";
import {
  getAllUsers,
  getAllUsersDelete,
} from "../controllers/usersController.js"; // ou autre nom selon ton projet
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createCourse,
  createNews,
  deleteCourse,
  deleteNews,
  getCourses,
  getNews,
  updateCourse,
  updateNews,
} from "../controllers/adminController.js";

const router = express.Router();

// Route accessible uniquement aux admins
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, getAllUsersDelete);

// Gestion des cours
router.get("/cours", getCourses);
router.post("/cours", createCourse);
router.put("/cours/:id", verifyToken, verifyAdmin, updateCourse);
router.delete("/cours/:id", verifyToken, verifyAdmin, deleteCourse);

// Gestion des actualités
router.get("/actualites", verifyToken, verifyAdmin, getNews);
router.post("/actualites", verifyToken, verifyAdmin, createNews);

router.put("/actualites/:id", verifyToken, verifyAdmin, updateNews);
router.delete("/actualites/:id", verifyToken, verifyAdmin, deleteNews);

export default router;
