// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé : Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret123"); // même clé que dans login
    req.user = decoded; // contient id, email, role
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès interdit" });
    }
    next();
  };
}
