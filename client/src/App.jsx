// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Profil from "./pages/Profil";
import AdminUsers from "./pages/AdminUsers";
import AjoutCours from "./pages/AjoutCours";
import ListeCours from "./pages/ListesCours";

function App() {
  const { user } = useAuth();
  console.log("Utilisateur connecté :", user);

  const location = useLocation();

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
          <AdminRoute>
            <AjoutCours />
          </AdminRoute>
        }
      />
      <Route path="/cours" element={<ListeCours />} />
    </Routes>
  );
}

export default App;
