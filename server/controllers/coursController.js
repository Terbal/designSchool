// server/controllers/coursController.js
import db from "../db.js";

export const createCours = async (req, res) => {
  const { titre, description, formateur_id } = req.body;

  try {
    // Admin ou formateur autorisés (plus besoin de refaire le contrôle ici car checkRole le fait déjà)

    const [result] = await db.query(
      "INSERT INTO cours (titre, description, formateur_id) VALUES (?, ?, ?)",
      [titre, description, formateur_id]
    );

    res
      .status(201)
      .json({ message: "Cours créé avec succès", id: result.insertId });
  } catch (err) {
    console.error("Erreur création cours:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getAllCours = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cours");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur récupération cours :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un cours
export const deleteCours = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit" });
    }

    await db.query("DELETE FROM cours WHERE id = ?", [id]);
    res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression cours :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Modifier un cours
export const updateCours = async (req, res) => {
  const { id } = req.params;
  const { titre, description, formateur_id } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit" });
    }

    await db.query(
      "UPDATE cours SET titre = ?, description = ?, formateur_id = ? WHERE id = ?",
      [titre, description, formateur_id, id]
    );

    res.status(200).json({ message: "Cours mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur mise à jour cours :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Liste des étudiants inscrits à un module donné
export const getEtudiantsParModule = async (req, res) => {
  try {
    const moduleId = req.params.id;

    const [rows] = await db.query(
      `
      SELECT u.id, u.nom, u.email
      FROM inscription i
      JOIN users u ON i.etudiant_id = u.id
      WHERE i.cours_id = ?
    `,
      [moduleId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération des étudiants du module :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
