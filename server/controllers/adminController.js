import db from "../db.js";

export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT
        c.*, u.nom AS formateur_nom,
        COUNT(i.id) AS studentCount
      FROM cours c
      LEFT JOIN users u ON c.formateur_id = u.id
      LEFT JOIN inscription i ON i.cours_id = c.id
      GROUP BY c.id
      ORDER BY c.date_creation DESC
    `);
    res.json(courses);
  } catch (error) {
    console.error("Erreur getCourses:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des cours." });
  }
};

export const createCourse = async (req, res) => {
  const { titre, description, formateur_id, duration, prix } = req.body;
  if (!titre || !description) {
    return res
      .status(400)
      .json({ error: "Le titre et la description sont obligatoires." });
  }
  try {
    await db.query(
      `INSERT INTO cours (titre, description, formateur_id, duration, prix)
       VALUES (?, ?, ?, ?, ?)`,
      [titre, description, formateur_id || null, duration || null, prix || null]
    );
    res.status(201).json({ message: "Cours créé avec succès" });
  } catch (error) {
    console.error("Erreur createCourse:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création du cours." });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { titre, description, formateur_id, duration, prix } = req.body;
  try {
    const [existing] = await db.query("SELECT id FROM cours WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Cours non trouvé." });
    }
    const fields = [];
    const values = [];
    if (titre !== undefined) {
      fields.push("titre = ?");
      values.push(titre);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (formateur_id !== undefined) {
      fields.push("formateur_id = ?");
      values.push(formateur_id);
    }
    if (duration !== undefined) {
      fields.push("duration = ?");
      values.push(duration);
    }
    if (prix !== undefined) {
      fields.push("prix = ?");
      values.push(prix);
    }
    values.push(id);
    await db.query(
      `UPDATE cours SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    res.json({ message: "Cours mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur updateCourse:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour du cours." });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT id FROM cours WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Cours non trouvé." });
    }
    await db.query("DELETE FROM cours WHERE id = ?", [id]);
    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteCourse:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression du cours." });
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
