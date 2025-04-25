// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profil from "./pages/Profil";
import AdminUsers from "./pages/AdminUsers";

function App() {
  const { user } = useAuth();
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
    </Routes>
  );
}

export default App;
