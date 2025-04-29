import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (mot_de_passe.length < 6) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    await db.query(
      "INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)",
      [nom, email, hashedPassword]
    );
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, email, mot_de_passe } = req.body;

  try {
    // Seuls l'utilisateur lui-même ou un admin peuvent modifier
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const fields = [];
    const values = [];

    if (nom) {
      fields.push("nom = ?");
      values.push(nom);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (mot_de_passe) {
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      fields.push("mot_de_passe = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
    }

    values.push(id); // Ajout de l'ID pour WHERE

    await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET user info
export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT id, nom, email, role FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // On vérifie que l'utilisateur est bien admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const [rows] = await db.query("SELECT id, nom, email, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération utilisateurs:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getAllUsersDelete = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  const userId = req.params.id;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error("Erreur suppression utilisateur:", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression utilisateur:", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

export const updatePassword = async (req, res) => {
  const { ancienMotDePasse, nouveauMotDePasse } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT mot_de_passe FROM users WHERE id = ?",
      [userId]
    );

    const user = rows[0];
    const isMatch = await bcrypt.compare(ancienMotDePasse, user.mot_de_passe);

    if (!isMatch) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
    await db.query("UPDATE users SET mot_de_passe = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

// PUT update user info
export const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { nom, email } = req.body;

  try {
    await db.query("UPDATE users SET nom = ?, email = ? WHERE id = ?", [
      nom,
      email,
      userId,
    ]);
    res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const loginUser = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  console.log("🔐 Requête de login reçue :", req.body); // 👈 Ajouté

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("📄 Utilisateur trouvé :", rows); // 👈 Ajouté

    if (rows.length === 0) {
      console.log("❌ Aucun utilisateur avec cet email");
      return res.status(400).json({ error: "Email incorrect" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    console.log("🔑 Mot de passe correspond :", isMatch); // 👈 Ajouté

    if (!isMatch) {
      console.log("❌ Mot de passe incorrect");
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "2h" }
    );

    console.log("✅ Connexion réussie, token généré");
    res.json({
      message: "Connexion réussie",
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role }, // ✅ on ajoute le rôle ici
      token,
    });
  } catch (error) {
    console.error("🔥 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};
