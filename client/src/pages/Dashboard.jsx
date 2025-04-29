// src/pages/Dashboard.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    // non connecté
    return <Navigate to="/login" replace />;
  }

  // redirections par rôle
  switch (user.role) {
    case "etudiant":
      return <Navigate to="/dashboard-etudiant" replace />;
    case "formateur":
      return <Navigate to="/dashboard-formateur" replace />;
    case "admin":
      return <Navigate to="/admin/users" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
