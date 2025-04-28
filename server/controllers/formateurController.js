// controllers/formateurController.js
import db from "../db.js";

export const getFormateurs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom FROM users WHERE role = 'formateur'"
    );
    res.status(200).json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des formateurs." });
  }
};

// Liste des modules (cours) que le formateur enseigne
export const getMesModules = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT id, titre, description
      FROM cours
      WHERE formateur_id = ?
    `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération des modules :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
