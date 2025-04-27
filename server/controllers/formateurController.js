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
