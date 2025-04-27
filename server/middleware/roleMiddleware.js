export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // injecté depuis le middleware d'auth
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
};
