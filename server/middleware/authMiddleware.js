// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("→ authHeader:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé : Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Utilise la clé du .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    console.log("Decoded payload:", decoded);
    req.user = {
      id: decoded.id,
      nom: decoded.nom, // ✅ disponible maintenant
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

// Vérifie si l'utilisateur est admin
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

// Vérifie si l'utilisateur a l'un des rôles autorisés
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
