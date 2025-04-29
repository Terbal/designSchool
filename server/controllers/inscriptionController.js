// server/controllers/inscriptionController.js
import db from "../db.js";

// Inscrire un étudiant à un cours spécifique
export const inscrireAuCours = async (req, res) => {
  const { coursId } = req.params;
  const userId = req.user.id;

  try {
    // Vérifier s'il est déjà inscrit
    const [check] = await db.query(
      "SELECT * FROM inscription WHERE etudiant_id = ? AND cours_id = ?",
      [userId, coursId]
    );

    if (check.length > 0) {
      return res.status(400).json({ message: "Déjà inscrit à ce cours." });
    }

    // Inscrire
    await db.query(
      "INSERT INTO inscription (etudiant_id, cours_id) VALUES (?, ?)",
      [userId, coursId]
    );

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Liste des cours auxquels l'étudiant est inscrit

export const getMesCours = async (req, res) => {
  const etudiantId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT c.*
       FROM inscription i
       JOIN cours c ON i.cours_id = c.id
       WHERE i.etudiant_id = ?`,
      [etudiantId]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur récupération mes-cours :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Deuxième méthode d'inscription (par body au lieu de params)
export const inscrireEtudiant = async (req, res) => {
  try {
    const { cours_id, creneau_id } = req.body;
    const { id: etudiant_id, nom, email } = req.user; // Depuis le token

    const [rows] = await db.execute(
      `INSERT INTO inscription 
      (cours_id, creneau_id, etudiant_id, etudiant_nom, etudiant_email)
      VALUES (?, ?, ?, ?, ?)`,
      [cours_id, creneau_id, etudiant_id, nom, email]
    );

    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};
