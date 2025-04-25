import db from "./db.js";

async function testInsertUser() {
  try {
    console.log("➕ Insertion d’un utilisateur...");

    const [result] = await db.execute(
      "INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      ["Alice Test", "alice@example.com", "motdepasse123", "formateur"]
    );

    console.log("✅ Utilisateur inséré !");
    console.log(
      "🆔 ID :",
      result.insertId,
      "✅ AffectedRows:",
      result.affectedRows
    );
  } catch (error) {
    console.error("❌ Erreur d’insertion :", error);
  } finally {
    await db.end();
    console.log("🔒 Connexion fermée.");
  }
}

testInsertUser();
