// server/controllers/statsController.js
import db from "../db.js";

// 1⃣ Utilisateurs par rôle
export const getUserStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT role, COUNT(*) AS count FROM users GROUP BY role`
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur stats utilisateurs:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 2⃣ Messages par période
export const getMessageStats = async (req, res) => {
  const { period } = req.query; // daily, weekly, monthly, yearly
  let dateFormat;
  switch (period) {
    case "weekly":
      dateFormat = "%Y-%u";
      break; // année-semaine ISO
    case "monthly":
      dateFormat = "%Y-%m";
      break; // année-mois
    case "yearly":
      dateFormat = "%Y";
      break; // année
    default:
      dateFormat = "%Y-%m-%d"; // daily
  }

  try {
    const [rows] = await db.query(
      `
      SELECT DATE_FORMAT(time, '${dateFormat}') AS label,
             COUNT(*) AS count
      FROM messages
      GROUP BY label
      ORDER BY label ASC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur stats messages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 3⃣ Top cours suivis
export const getCourseStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT c.titre,
             COUNT(i.id) AS enrollments
      FROM cours c
      LEFT JOIN inscription i ON c.id = i.cours_id
      GROUP BY c.id, c.titre
      ORDER BY enrollments DESC
      LIMIT 10
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur stats cours:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
