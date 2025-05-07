// server/controllers/actualitesController.js
import db from "../db.js"; // adapte le chemin si ta connexion est ailleurs

export const getAllActualites = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, titre, contenu, date_publication FROM actualites ORDER BY date_publication DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération actualités :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createActualite = async (req, res) => {
  const { titre, contenu } = req.body;
  if (!titre || !contenu) {
    return res.status(400).json({ error: "Titre et contenu sont requis." });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO actualites (titre, contenu) VALUES (?, ?)",
      [titre, contenu]
    );
    res.status(201).json({ id: result.insertId, titre, contenu });
  } catch (err) {
    console.error("Erreur création actualité :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateActualite = async (req, res) => {
  const { id } = req.params;
  const { titre, contenu } = req.body;
  try {
    await db.query(
      "UPDATE actualites SET titre = ?, contenu = ? WHERE id = ?",
      [titre, contenu, id]
    );
    res.json({ message: "Actualité mise à jour" });
  } catch (err) {
    console.error("Erreur modification actualité :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteActualite = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM actualites WHERE id = ?", [id]);
    res.json({ message: "Actualité supprimée" });
  } catch (err) {
    console.error("Erreur suppression actualité :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
