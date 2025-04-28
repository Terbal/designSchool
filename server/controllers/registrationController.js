import db from "../config/db.js";

export const registerCourse = async (req, res) => {
  try {
    const { course_id, firstname, lastname, email, phone, payment_method } =
      req.body;
    const cv = req.file ? req.file.filename : null;

    if (
      !course_id ||
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !payment_method
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    await db.query(
      "INSERT INTO registrations (course_id, firstname, lastname, email, phone, cv, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [course_id, firstname, lastname, email, phone, cv, payment_method]
    );

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
