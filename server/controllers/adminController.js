import db from "../db.js";

export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
        SELECT c.*, u.nom as formateur_nom 
        FROM cours c
        LEFT JOIN users u ON c.formateur_id = u.id
      `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createCourse = async (req, res) => {
  const { titre, description, formateur_id, duration, prix } = req.body;
  try {
    await db.query(
      "INSERT INTO cours (titre, description, formateur_id, duration, prix) VALUES (?, ?, ?, ?, ?)",
      [titre, description, formateur_id, duration, prix]
    );
    res.status(201).json({ message: "Cours créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour un cours
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { titre, description, formateur_id, duration, prix } = req.body;

  try {
    // Vérifier d'abord si le cours existe
    const [existingCourse] = await db.query(
      "SELECT * FROM cours WHERE id = ?",
      [id]
    );

    if (existingCourse.length === 0) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    // Mise à jour dynamique des champs
    const updates = [];
    const values = [];

    if (titre) {
      updates.push("titre = ?");
      values.push(titre);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (formateur_id) {
      updates.push("formateur_id = ?");
      values.push(formateur_id);
    }
    if (duration) {
      updates.push("duration = ?");
      values.push(duration);
    }
    if (prix) {
      updates.push("prix = ?");
      values.push(prix);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Aucun champ à mettre à jour" });
    }

    values.push(id); // Ajouter l'ID à la fin pour la clause WHERE

    await db.query(
      `UPDATE cours SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    res.json({ message: "Cours mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour cours:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un cours
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier d'abord si le cours existe
    const [existingCourse] = await db.query(
      "SELECT * FROM cours WHERE id = ?",
      [id]
    );

    if (existingCourse.length === 0) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    await db.query("DELETE FROM cours WHERE id = ?", [id]);

    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression cours:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getNews = (req, res) => {
  const sql = "SELECT * FROM actualites ORDER BY date_publication DESC";
  req.db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des actualités." });
    res.status(200).json(results);
  });
};

export const createNews = (req, res) => {
  const { titre, contenu } = req.body;
  const sql = "INSERT INTO actualites (titre, contenu) VALUES (?, ?)";
  req.db.query(sql, [titre, contenu], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Erreur lors de l'ajout de l'actualité." });
    res.status(201).json({ message: "Actualité créée avec succès." });
  });
};

export const updateNews = (req, res) => {
  const { id } = req.params;
  const { titre, contenu } = req.body;
  const sql = "UPDATE actualites SET titre = ?, contenu = ? WHERE id = ?";
  req.db.query(sql, [titre, contenu, id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Erreur lors de la mise à jour." });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Actualité non trouvée." });
    res.status(200).json({ message: "Actualité mise à jour avec succès." });
  });
};

export const deleteNews = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM actualites WHERE id = ?";
  req.db.query(sql, [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Erreur lors de la suppression." });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Actualité non trouvée." });
    res.status(200).json({ message: "Actualité supprimée avec succès." });
  });
};
