// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import PrivateRoute from "./components/PrivateRoute";
import Profil from "./pages/Profil";
import AdminUsers from "./pages/AdminUsers";
import AjoutCours from "./pages/AjoutCours";
import ListeCours from "./pages/ListesCours";
import ListeEtudiantsParModule from "./pages/ListeEtudiantsParModule";
import MesCours from "./components/MesCours";
import DetailsCours from "./components/DetailsCour";
import { CircularProgress, Box } from "@mui/material"; // Pour spinner dans la route
import FormulaireInscription from "./components/FormulaireInscription";
import ContenuCours from "./pages/ContenuCours";
import ChatClasse from "./pages/ChatClasse";
import Messagerie from "./pages/Messagerie";
import DashboardAdmin from "./pages/DashboardAdmin";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
      <Route
        path="/profil"
        element={
          <PrivateRoute>
            <Profil />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          user?.role === "admin" ? (
            <PrivateRoute>
              <AdminUsers />
            </PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/ajout-cours"
        element={
          user?.role === "admin" || user?.role === "formateur" ? (
            <PrivateRoute>
              <AjoutCours />
            </PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/cours" element={<ListeCours />} />
      <Route
        path="/modules/:id/etudiants"
        element={<ListeEtudiantsParModule />}
      />
      <Route path="/cours/:id" element={<DetailsCours />} />
      <Route path="/mes-cours" element={<MesCours />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            {user?.role === "admin" ? <DashboardAdmin /> : <Navigate to="/" />}
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard-etudiant"
        element={
          user?.role === "etudiant" ? (
            <PrivateRoute>
              <DashboardEtudiant />
            </PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/inscription/:id"
        element={
          <PrivateRoute>
            <FormulaireInscription />
          </PrivateRoute>
        }
      />
      ;
      <Route
        path="/messagerie"
        element={
          <PrivateRoute>
            <Messagerie />
          </PrivateRoute>
        }
      />
      <Route
        path="/cours/:coursId/messagerie"
        element={
          <PrivateRoute>
            <Messagerie />
          </PrivateRoute>
        }
      />
      <Route path="/cours/:id/contenu" element={<ContenuCours />} />
    </Routes>
  );
}

export default App;
