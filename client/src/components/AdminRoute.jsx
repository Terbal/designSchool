import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material"; // ✅ Ajout

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    ); // ✅ Spinner centré

  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
