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
      SELECT
        i.id,
        u.nom,
        u.email,
        i.date_inscription,
        c.date       AS creneau_date,
        c.heure      AS creneau_heure
      FROM inscription i
      JOIN users u ON i.etudiant_id = u.id
      JOIN creneaux c ON i.creneau_id = c.id
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

export const getCoursById = async (req, res) => {
  try {
    const [coursResult] = await db.execute(`SELECT * FROM cours WHERE id = ?`, [
      req.params.id,
    ]);

    if (coursResult.length === 0) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    const cours = coursResult[0];

    // Jointure : on récupère les créneaux associés
    const [creneaux] = await db.execute(
      `SELECT c.id, c.date, c.heure, c.places_disponibles
   FROM creneaux c
   WHERE c.cours_id = ?`,
      [id]
    );

    cours.creneaux = creneaux;

    res.json(cours);
  } catch (error) {
    console.error("Erreur lors de la récupération du cours :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
