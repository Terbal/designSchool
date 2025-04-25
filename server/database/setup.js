import fs from "fs";
import db from "../db.js";

const initSQL = fs.readFileSync("./database/init.sql", "utf8");

(async () => {
  try {
    await db.query(initSQL);
    console.log("📦 Tables créées avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur de création des tables :", err);
    process.exit(1);
  }
})();
