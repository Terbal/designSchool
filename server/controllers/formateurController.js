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

// controllers/formateurController.js
export const createModule = async (req, res) => {
  const { titre, description } = req.body;
  const formateurId = req.user.id;
  try {
    const [result] = await db.query(
      "INSERT INTO cours (titre, description, formateur_id) VALUES (?, ?, ?)",
      [titre, description, formateurId]
    );
    res.status(201).json({ id: result.insertId, titre, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création module" });
  }
};

// Crée un nouveau créneau pour un module donné
export const createCreneau = async (req, res) => {
  const formateurId = req.user.id;
  const { id: coursId } = req.params;
  const { date, heure, places_disponibles } = req.body;

  try {
    // Vérifier que le formateur est bien propriétaire du cours
    const [[cours]] = await db.query(
      "SELECT formateur_id FROM cours WHERE id = ?",
      [coursId]
    );
    if (!cours || cours.formateur_id !== formateurId) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    // Insertion du créneau
    const [result] = await db.query(
      "INSERT INTO creneaux (cours_id, date, heure, places_disponibles) VALUES (?, ?, ?, ?)",
      [coursId, date, heure, places_disponibles || 0]
    );
    // Récupérer le créneau fraîchement créé
    const [[newCreneau]] = await db.query(
      "SELECT * FROM creneaux WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newCreneau);
  } catch (err) {
    console.error("Erreur création créneau :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
